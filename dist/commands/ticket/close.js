"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _TicketUtil = require('@ticket/TicketUtil');







class CloseTicketCommand extends _Command2.default {
  constructor() {
    super('close', {
      aliases: ['close', 'fecharticket', 'fechar'],
      category: 'ticket',
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticket',
          type: (w, msg, args) => _TicketUtil.findTicketTypeArg.call(void 0, w, msg, args, this.client.commandHandler.resolver.type, true),
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:close.args.ticket.start'),
            retry: _Command.Prompt.call(void 0, 'commands:close.args.ticket.retry'),
          },
        },
        {
          id: 'rating',
          type: (w, msg, args) => {
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
            start: _Command.Prompt.call(void 0, 'commands:kick.args.rating.start'),
            retry: _Command.Prompt.call(void 0, 'commands:kick.args.rating.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: _Command.Prompt.call(void 0, 'commons:cancel'),
      },
    });
  }

  async run(msg, t, args) {
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
      const data = {
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

exports. default = CloseTicketCommand;
