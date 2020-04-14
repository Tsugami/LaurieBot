import { Role, TextChannel, CategoryChannel } from 'discord.js';
import ModuleCommand, { ModuleOptionArgs, ModuleArgTypes } from '@struct/command/ModuleCommand';
import LaurieEmbed from '@struct/LaurieEmbed';
import categories from '@struct/command/categories';

const validate = (_: any, { guildData: { data } }: ModuleOptionArgs) => {
  return !!data.ticket?.active;
};

export default ModuleCommand(
  'tkconfig',
  {
    aliases: ['configurartk'],
    userPermissions: 'MANAGE_GUILD',
    channelRestriction: 'guild',
  },
  [
    {
      id: 'enable',
      validate: (_, a) => !validate(null, a),
      async run(msg, t, { guildData }) {
        await guildData.ticket.enable();
        const commands = categories.ticket.map<[string, string]>(c => [
          c.id,
          t(`commands:${c.id.replace('-', '_')}.description`),
        ]);
        msg.reply(
          new LaurieEmbed(msg.author)
            .setDescription(t('commands:ativar_tk.message', { prefix: msg.client.commandHandler.prefix }))
            .setTitle(t('commands:ativar_tk.title'))
            .addFields(commands),
        );
      },
    },
    {
      id: 'disable',
      validate,
      async run(msg, t, { guildData }) {
        await guildData.ticket.disable();
        msg.reply(t('commands:desativar_tk.message'));
      },
    },
    {
      id: 'set_role',
      validate,
      async run(msg, t, { guildData, role }: ModuleOptionArgs & { role: Role }) {
        await guildData.ticket.setRole(role);
        msg.reply(t('commands:setcargo_tk.message'));

        if (!guildData.data.ticket) return;

        guildData.data.ticket.tickets.forEach(ticket => {
          if (!ticket.closed && msg.guild.channels.has(ticket.channelId)) {
            const channel = msg.guild.channels.get(ticket.channelId);
            if (channel instanceof TextChannel) {
              channel.overwritePermissions(role, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
              });
            }
          }
        });
      },
    },
    {
      id: 'set_category',
      validate,
      async run(msg, t, { guildData, category }: ModuleOptionArgs & { category: CategoryChannel }) {
        await guildData.ticket.setCategory(category);
        msg.reply(t('commands:setcategoria_tk.message'));

        if (!guildData.data.ticket) return;

        guildData.data.ticket.tickets.forEach(ticket => {
          if (!ticket.closed && msg.guild.channels.has(ticket.channelId)) {
            const channel = msg.guild.channels.get(ticket.channelId);
            if (channel instanceof TextChannel) {
              channel.setParent(category);
            }
          }
        });
      },
    },
  ],
  {
    role: ['role', ['set_role']],
    category: ['categoryChannel' as ModuleArgTypes, ['set_category']],
  },
  (m, t, { guildData }) => {
    if (validate(m, { guildData })) {
      const role = m.guild.roles.get(String(guildData.ticket.role))?.toString() || t('commands:tkconfig.none_role');
      const category =
        m.guild.channels.get(String(guildData.ticket.categoryId))?.toString() || t('commands:tkconfig.none_category');
      return [
        [t('commands:tkconfig.current_role'), String(role)],
        [t('commands:tkconfig.current_category'), String(category)],
      ];
    }
    return [];
  },
);
