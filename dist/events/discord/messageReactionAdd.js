"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordakairo = require('discord-akairo');
var _discordjs = require('discord.js');
var _index = require('@database/index');

var _TicketUtil = require('@ticket/TicketUtil');
var _Command = require('@struct/Command');

 class MessageReactionAddListener extends _discordakairo.Listener {
  constructor() {
    super('messageReactionAdd', {
      emitter: 'client',
      eventName: 'messageReactionAdd',
    });
  }

  async exec(reaction, user, guildDataFetch) {
    if (user.bot) return;

    const category = _TicketUtil.getCategoryByEmoji.call(void 0, reaction.emoji.name);
    if (!category) return;

    const msg = reaction.message;
    const guildData = guildDataFetch || (await _index.guild.call(void 0, msg.guild.id));
    // Ticket Module
    const TicketData = guildData && guildData.data.ticket;
    const TicketMessageId = TicketData && TicketData.messageId;
    if (TicketMessageId === msg.id) {
      const t = _Command.getFixedT.call(void 0, msg);
      const channelExists = (id) => msg.guild.channels.has(id);
      const hasTicket =
        TicketData.tickets &&
        TicketData.tickets.find(x => {
          return x.authorId === user.id && !x.closed && channelExists(x.channelId);
        });

      if (hasTicket) {
        const channel = msg.guild.channels.get(hasTicket.channelId);
        if (channel instanceof _discordjs.TextChannel) {
          channel.send(t('modules:ticket.user_already_has_ticket', { author: user }));
        }
      } else {
        // Create Ticket
        const permissionOverwrites = [
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

        const channelNumber = String(msg.guild.channels.filter(x => _TicketUtil.TicketNameRegex.test(x.name)).size + 1);
        const num = '0000'.substring(0, 4 - channelNumber.length) + channelNumber;
        const ticketChannel = await msg.guild.createChannel(`ticket-${num}`, {
          type: 'text',
          parent: TicketData.categoryId,
          permissionOverwrites,
        });

        if (ticketChannel instanceof _discordjs.TextChannel) {
          await guildData.updateTickets({ authorId: user.id, channelId: ticketChannel.id, category });
          const roleStr = role ? role.toString() : '';
          await ticketChannel.send(t('modules:ticket.ticket_created', { author: user, role: roleStr }));
        }
      }

      await reaction.remove(user);
    }
  }
} exports.default = MessageReactionAddListener;
