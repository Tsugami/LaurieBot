import { Listener } from 'discord-akairo';
import { MessageReaction, User, TextChannel, ChannelCreationOverwrites } from 'discord.js';
import { guild } from '@database/index';
import GuildController from '@database/controllers/GuildController';
import { getCategoryByEmoji, TicketNameRegex } from '@ticket/TicketUtil';

export default class MessageReactionAddListener extends Listener {
  constructor() {
    super('messageReactionAdd', {
      emitter: 'client',
      eventName: 'messageReactionAdd',
    });
  }

  async exec(reaction: MessageReaction, user: User, guildDataFetch?: GuildController) {
    if (user.bot) return;

    const category = getCategoryByEmoji(reaction.emoji.name);
    if (!category) return;

    const msg = reaction.message;
    const guildData = guildDataFetch || (await guild(msg.guild.id));
    // Ticket Module
    const TicketData = guildData && guildData.data.ticket;
    const TicketMessageId = TicketData && TicketData.messageId;
    if (TicketMessageId === msg.id) {
      const channelExists = (id: string): boolean => msg.guild.channels.has(id);
      const hasTicket =
        TicketData.tickets &&
        TicketData.tickets.find(x => {
          return x.authorId === user.id && !x.closed && channelExists(x.channelId);
        });

      if (hasTicket) {
        const channel = msg.guild.channels.get(hasTicket.channelId);
        if (channel instanceof TextChannel) {
          channel.send(`${user.toString()}, você não pode criar outro ticket com esse aberto.`);
        }
      } else {
        // Create Ticket
        const permissionOverwrites: ChannelCreationOverwrites[] = [
          {
            id: user.id,
            allow: 'VIEW_CHANNEL',
          },
          {
            id: msg.guild.id,
            deny: 'VIEW_CHANNEL',
          },
        ];

        const role = TicketData.role && msg.guild.roles.get(TicketData.role);
        if (role)
          permissionOverwrites.push({
            id: role,
            allow: 'VIEW_CHANNEL',
          });

        const channelNumber = String(msg.guild.channels.filter(x => TicketNameRegex.test(x.name)).size + 1);
        const num = '0000'.substring(0, 4 - channelNumber.length) + channelNumber;
        const ticketChannel = await msg.guild.createChannel(`ticket-${num}`, {
          type: 'text',
          parent: TicketData.categoryId,
          permissionOverwrites,
        });

        if (ticketChannel instanceof TextChannel) {
          await guildData.updateTickets({ authorId: user.id, channelId: ticketChannel.id, category });

          await ticketChannel.send(`${user.toString()}, ticket criado!\n${role ? role.toString() : ''}`);
        }
      }

      await reaction.remove(user);
    }
  }
}
