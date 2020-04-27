import Command from '@structures/LaurieCommand';
import { Message, User, Guild, ChannelCreationOverwrites, TextChannel, GuildCreateChannelOptions } from 'discord.js';
import LaurieEmbed from '@structures/LaurieEmbed';
import TicketUtil from '@utils/modules/ticket';
import { TICKET_EMOJIS } from '@utils/constants';

function TicketChannelName(server: Guild) {
  const channelNumber = String(
    server.channels.cache.filter(channel => TicketUtil.TICKET_NAME_REGEX.test(channel.name)).size + 1,
  );
  return `ticket-${'0000'.substring(0, 4 - channelNumber.length)}${channelNumber}`;
}

function TicketChannelPermissionOverwrites(author: User, server: Guild, roleId?: string): ChannelCreationOverwrites[] {
  const permissionOverwrites: ChannelCreationOverwrites[] = [
    {
      id: author.id,
      allow: 'VIEW_CHANNEL',
    },
    {
      id: server.id,
      deny: 'VIEW_CHANNEL',
    },
  ];

  const role = roleId && server.roles.cache.get(roleId);
  if (role)
    permissionOverwrites.push({
      id: role,
      allow: 'VIEW_CHANNEL',
    });

  return permissionOverwrites;
}

export default class AbrirTk extends Command {
  constructor() {
    super('abrir-tk', {
      aliases: ['abrir-ticket', 'abrirtk'],
      category: 'ticket',
      editable: false,
      channel: 'guild',
      clientPermissions: ['MANAGE_CHANNELS', 'ADD_REACTIONS'],
    });
  }

  async exec(msg: Message) {
    const guild = msg.guild as Guild;
    const guildData = await this.client.database.getGuild(guild.id);

    const ticketOpened = guildData.ticket.getTicket(msg.author, guild);
    if (ticketOpened) {
      const channel = guild.channels.cache.get(ticketOpened.channelId)?.toString();
      return msg.reply(msg.t('commands:abrir_tk.already_has_ticket_opened', { channel }));
    }

    const sent = await msg.reply(
      new LaurieEmbed(msg.author).setDescription(
        `${msg.t('commands:abrir_tk.message')}\n\n
        ${TICKET_EMOJIS.QUESTION} **${msg.t('modules:ticket.question_ticket')}**
        ${TICKET_EMOJIS.REPORT} **${msg.t('modules:ticket.report_ticket')}**
        ${TICKET_EMOJIS.REVIEW} **${msg.t('modules:ticket.review_ticket')}**`,
      ),
    );

    if (sent instanceof Message) {
      const sendEMOJIS = async () => {
        await sent.react(TICKET_EMOJIS.QUESTION);
        await sent.react(TICKET_EMOJIS.REPORT);
        await sent.react(TICKET_EMOJIS.REVIEW);
      };

      sendEMOJIS();

      const collector = sent.createReactionCollector((r, u) => r.me && msg.author.id === u.id);

      collector.on('collect', async e => {
        const parent = guildData.data.ticket && guildData.data.ticket.categoryId;
        const roleId = guildData.data.ticket && guildData.data.ticket.role;
        const permissionOverwrites = TicketChannelPermissionOverwrites(msg.author, guild, roleId);

        const options: GuildCreateChannelOptions = { permissionOverwrites };
        if (parent) options.parent = parent;

        const channel = await guild.channels.create(TicketChannelName(guild), options);

        const category = TicketUtil.getCategoryByEmoji(e.emoji.toString()) || 'question';

        if (channel instanceof TextChannel) {
          const ticket = await guildData.ticket.openTicket(channel, msg.author, category);
          // eslint-disable-next-line no-underscore-dangle
          if (!ticket || !ticket._id) {
            channel.delete();
            await sent.delete();
            msg.reply(msg.t('commands:abrir_tk.failed'));
            return;
          }

          channel.send(msg.author.toString(), {
            embed: new LaurieEmbed(msg.author).addInfoText(
              'WALLET',
              msg.t('commands:abrir_tk.title'),
              [
                TicketUtil.getEmojiByCategory(category),
                msg.t('commons:category'),
                `${msg.t(`modules:ticket.${category}_ticket`)}`,
              ],

              ['PERSON', msg.t('commons:created_by'), msg.author.toString()],
              // eslint-disable-next-line no-underscore-dangle
              ['COMPUTER', msg.t('commons:id'), `${ticket && ticket._id}`],
            ),
          });
          await sent.delete();
          msg.reply(
            msg.t('commands:abrir_tk.ticket_created', { channel: channel.toString(), emoji: e.emoji.toString() }),
          );
        }
      });
    }
  }
}
