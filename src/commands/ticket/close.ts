import Command, { TFunction, Prompt } from '@struct/Command';

import { Message } from 'discord.js';
import { findTicketTypeArg, TicketArgType } from '@ticket/TicketUtil';
import { Ticket } from 'database/models/Guild';

interface ArgsI {
  ticket: TicketArgType;
  rating: number | string;
}

class CloseTicketCommand extends Command {
  constructor() {
    super('close', {
      aliases: ['close', 'fecharticket', 'fechar'],
      category: 'ticket',
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticket',
          type: (w, msg, args) => findTicketTypeArg(w, msg, args, this.client.commandHandler.resolver.type, true),
          prompt: {
            start: Prompt('commands:close.args.ticket.start'),
            retry: Prompt('commands:close.args.ticket.retry'),
          },
        },
        {
          id: 'rating',
          type: (w, msg, args: ArgsI) => {
            if (typeof args.ticket === 'object') {
              if (args.ticket.ticket.authorId === msg.author.id) {
                const num = parseInt(w, 10);
                if (!Number.isNaN(num)) {
                  if (num > 10) return 10;
                  if (num < 0) return 0;
                  return num;
                }
                return null;
              }
              return '';
            }
            return '';
          },
          prompt: {
            start: Prompt('commands:kick.args.rating.start'),
            retry: Prompt('commands:kick.args.rating.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: Prompt('commons:cancel'),
      },
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    if (args.ticket === 'desabilidado') {
      return msg.reply(t('commands:close.ticket_module_disabled'));
    }
    if (args.ticket === 'no-tickets') {
      return msg.reply(t('commands:close.not.tickets'));
    }
    if (args.ticket === 'user-no-ticket') {
      return msg.reply(t('commands:close.not.tickets_open'));
    }
    if (args.ticket === 'user-no-perm') {
      return msg.reply(t('commands:close.not.permission'));
    }
    if (args.ticket === 'all-closed') {
      return msg.reply(t('commands:close.tickets_all_closed'));
    }

    const { guildData, ticket } = args.ticket;
    if (ticket.closed) {
      return msg.reply(t('commands:close.already_ticket_closed'));
    }

    const closeTicket = async () => {
      const channel = msg.guild.channels.get(ticket.channelId);
      if (channel) await channel.delete();
      const data: Ticket = {
        channelId: ticket.channelId,
        authorId: ticket.authorId,
        category: ticket.category,
        closed: true,
        closedAt: new Date(),
        closedBy: msg.author.id,
      };

      if (data && typeof args.rating === 'number') data.rating = args.rating;

      return guildData.updateTickets(data);
    };

    await closeTicket();

    // eslint-disable-next-line no-underscore-dangle
    const infocmd = `${this.client.commandHandler.prefix(msg)}ticket-info ${ticket._id}`;
    if (ticket.authorId === msg.author.id) {
      return msg.reply(t('commands:close.you_ticket_closed', { infocmd }));
    }
    return msg.reply(t('commands:close.ticket_closed', { infocmd }));
  }
}

export default CloseTicketCommand;
