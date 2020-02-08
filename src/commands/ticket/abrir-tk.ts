import Command, { TFunction } from '@struct/Command';
import { Message, MessageReaction, User, Guild, ChannelCreationOverwrites, TextChannel, ChannelData } from 'discord.js';
import { guild } from '@database/index';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { getCategoryByEmoji, getEmojiByCategory } from '@utils/TicketUtil';
import { TICKET_EMOJIS, Emojis } from '@utils/Constants';

export default class AbrirTicket extends Command {
  readonly TICKET_NAME_REGEX = /ticket-([0-9])/;

  constructor() {
    super('abrir-tk', {
      aliases: ['abrir-ticket', 'abrir-tk', 'abrirtk'],
      help: 'abrir-tk',
      category: 'ticket',
      clientPermissions: ['MANAGE_CHANNELS', 'ADD_REACTIONS'],
    });
  }

  async run(msg: Message, t: TFunction) {
    const guildData = await guild(msg.guild.id);

    const ticketOpened = guildData.ticket.getTicket(msg.author, msg.guild);
    if (ticketOpened) {
      const channel = msg.guild.channels.get(ticketOpened.channelId);
      return msg.reply(t('commands:abrir_tk.already_has_ticket_opened', { channel }));
    }

    const sent = await msg.reply(
      new Embed(msg.author).setDescription(
        `${t('commands:abrir_tk.message')}\n\n${TICKET_EMOJIS.QUESTION} **${t('modules:ticket.question_ticket')}**\n${
          TICKET_EMOJIS.REPORT
        } **${t('modules:ticket.report_ticket')}**\n${TICKET_EMOJIS.REVIEW} **${t('modules:ticket.review_ticket')}**\n`,
      ),
    );

    if (sent instanceof Message) {
      sent.react(TICKET_EMOJIS.QUESTION);
      sent.react(TICKET_EMOJIS.REPORT);
      sent.react(TICKET_EMOJIS.REVIEW);

      const collector = sent.createReactionCollector((r: MessageReaction, u: User) => r.me && msg.author.id === u.id);

      collector.on('collect', async e => {
        const parent = guildData.data.ticket && guildData.data.ticket.categoryId;
        const roleId = guildData.data.ticket && guildData.data.ticket.role;
        const permissionOverwrites = this.TicketChannelPermissionOverwrites(msg.author, msg.guild, roleId);

        const options: ChannelData = { permissionOverwrites, type: 'text' };
        if (parent) options.parent = parent;

        const channel = await msg.guild.createChannel(this.TicketChannelName(msg.guild), options);

        const category = getCategoryByEmoji(e.emoji.toString()) || 'question';

        if (channel instanceof TextChannel) {
          const ticket = await guildData.ticket.openTicket(channel, msg.author, category);
          // eslint-disable-next-line no-underscore-dangle
          if (!ticket || !ticket._id) {
            channel.delete();
            await sent.delete();
            msg.reply('commands:abrir_tk.failed');
            return;
          }

          channel.send(msg.author.toString(), {
            embed: new Embed(msg.author).setDescription(
              new Text()
                .addTitle(Emojis.WALLET, t('commands:abrir_tk.title'))
                .addField(
                  getEmojiByCategory(category),
                  t('commons:category'),
                  `${t(`modules:ticket.${category}_ticket`)}`,
                )
                .addField(Emojis.PERSON, t('commons:created_by'), msg.author.toString())
                // eslint-disable-next-line no-underscore-dangle
                .addField(Emojis.COMPUTER, t('commons:id'), `${ticket && ticket._id}`),
            ),
          });
          await sent.delete();
          msg.reply(t('commands:abrir_tk.ticket_created', { channel, emoji: e.emoji.toString() }));
        }
      });
    }
  }

  TicketChannelName(server: Guild) {
    const channelNumber = String(server.channels.filter(channel => this.TICKET_NAME_REGEX.test(channel.name)).size + 1);
    return `ticket-${'0000'.substring(0, 4 - channelNumber.length)}${channelNumber}`;
  }

  TicketChannelPermissionOverwrites(author: User, server: Guild, roleId?: string): ChannelCreationOverwrites[] {
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

    const role = roleId && server.roles.get(roleId);
    if (role)
      permissionOverwrites.push({
        id: role,
        allow: 'VIEW_CHANNEL',
      });

    return permissionOverwrites;
  }
}
