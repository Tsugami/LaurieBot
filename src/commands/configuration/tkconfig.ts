import { Role, TextChannel, CategoryChannel } from 'discord.js';
import ModuleCommand from '@structures/ModuleCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import GuildController from '@database/controllers/GuildController';

const validate = (_: any, guildData: GuildController) => {
  return !!guildData.ticket.active;
};

export default class TkConfig extends ModuleCommand {
  constructor() {
    super(
      'tkconfig',

      [
        {
          id: 'enable',
          validate: (_, a) => !validate(null, a),
          async run(msg, guildData) {
            await guildData.ticket.enable();
            const ticketCategory = this.handler.categories.get('ticket');
            if (!ticketCategory) {
              throw new Error('n achei a categoria ticket');
            }

            const embed = new LaurieEmbed(msg.author)
              .setDescription(msg.t('commands:ativar_tk.message', { prefix: this.handler.prefix }))
              .setTitle(msg.t('commands:ativar_tk.title'));

            for (const command of ticketCategory.values()) {
              embed.addField(command.id, msg.t(command.description));
            }
            msg.reply(embed);
          },
        },
        {
          id: 'disable',
          validate,
          async run(msg, guildData) {
            await guildData.ticket.disable();
            msg.reply(msg.t('commands:desativar_tk.message'));
          },
        },
        {
          id: 'set_role',
          validate,
          async run(msg, guildData, { role }: { role: Role }) {
            await guildData.ticket.setRole(role);
            msg.reply(msg.t('commands:setcargo_tk.message'));

            if (!guildData.data.ticket) return;

            guildData.data.ticket.tickets.forEach(ticket => {
              if (!ticket.closed && msg.guild?.channels.cache.has(ticket.channelId)) {
                const channel = msg.guild?.channels.cache.get(ticket.channelId);
                if (channel instanceof TextChannel) {
                  channel.overwritePermissions([
                    {
                      id: role.id,
                      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                    },
                  ]);
                }
              }
            });
          },
        },
        {
          id: 'set_category',
          validate,
          async run(msg, guildData, { category }: { category: CategoryChannel }) {
            await guildData.ticket.setCategory(category);
            msg.reply(msg.t('commands:setcategoria_tk.message'));

            if (!guildData.data.ticket) return;

            guildData.data.ticket.tickets.forEach(ticket => {
              if (!ticket.closed && msg.guild?.channels.cache.has(ticket.channelId)) {
                const channel = msg.guild.channels.cache.get(ticket.channelId);
                if (channel instanceof TextChannel) {
                  channel.setParent(category);
                }
              }
            });
          },
        },
      ],
      [
        [['role', 'set_role'], { id: 'role', type: 'role' }],
        [['set_category'], { id: 'category', type: 'categoryChannel' }],
      ],
      {
        aliases: ['configurartk'],
        userPermissions: 'MANAGE_GUILD',
        channel: 'guild',
      },
      (embed, m, guildData) => {
        if (validate(m, guildData)) {
          const role = m.guild?.roles.cache.get(String(guildData.ticket.role))?.toString();
          const category = m.guild?.channels.cache.get(String(guildData.ticket.categoryId))?.toString();
          embed.addField(m.t('commands:tkconfig.current_role'), role ?? m.t('commands:tkconfig.none_role'));
          embed.addField(m.t('commands:tkconfig.current_category'), category ?? m.t('commands:tkconfig.none_category'));
        }
      },
    );
  }
}
