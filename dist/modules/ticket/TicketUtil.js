"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Constants = require('@utils/Constants');

var _index = require('@database/index');

var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _discordjs = require('discord.js');


 const TicketNameRegex = /ticket-([0-9])/; exports.TicketNameRegex = TicketNameRegex;

 function isTicketEmoji(emoji) {
  return emoji === _Constants.TICKET_EMOJIS.QUESTION || emoji === _Constants.TICKET_EMOJIS.REPORT || emoji === _Constants.TICKET_EMOJIS.REVIEW;
} exports.isTicketEmoji = isTicketEmoji;

 function getCategoryByEmoji(emoji) {
  if (emoji === _Constants.TICKET_EMOJIS.QUESTION) return 'question';
  if (emoji === _Constants.TICKET_EMOJIS.REPORT) return 'report';
  if (emoji === _Constants.TICKET_EMOJIS.REVIEW) return 'review';
  return null;
} exports.getCategoryByEmoji = getCategoryByEmoji;

 function getEmojiByCategory(category) {
  if (category === 'question') return _Constants.TICKET_EMOJIS.QUESTION;
  if (category === 'report') return _Constants.TICKET_EMOJIS.REPORT;
  return _Constants.TICKET_EMOJIS.REVIEW;
} exports.getEmojiByCategory = getEmojiByCategory;

 async function addUserList(msg, guildData) {
  const ticketData = guildData.data.ticket;

  if (ticketData && ticketData.active && ticketData.tickets && ticketData.tickets.length) {
    const { tickets } = ticketData;
    const ticket = tickets.find(x => x.channelId === msg.channel.id && !x.closed);
    if (ticket) {
      const users = ticket.users || [];
      if (!users.includes(msg.author.id)) {
        guildData.updateTickets({
          channelId: ticket.channelId,
          authorId: ticket.authorId,
          category: ticket.category,
          users,
        });
      }
    }
  }
} exports.addUserList = addUserList;

 function isMainChannel(msg, guildData) {
  return guildData.data.ticket && guildData.data.ticket.active && msg.channel.id === guildData.data.ticket.channelId;
} exports.isMainChannel = isMainChannel;

 async function createMainMessage(server, channel, guildData) {
  const channelData = {
    permissionOverwrites: [
      {
        id: server,
        deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
      },
    ],
  };

  if (guildData.data.ticket && guildData.data.ticket.categoryId) {
    channelData.parent = guildData.data.ticket.categoryId;
    channelData.position = 0;
  }

  await channel.edit(channelData);

  const embed = new (0, _Embed2.default)(server.client.user).setAuthor("Ticket's").setDescription('Descrição explicativa');
  if (server.iconURL) embed.setThumbnail(server.iconURL);

  const msg = await channel.send(embed);

  if (msg instanceof _discordjs.Message) {
    msg.react(_Constants.TICKET_EMOJIS.QUESTION);
    msg.react(_Constants.TICKET_EMOJIS.REPORT);
    msg.react(_Constants.TICKET_EMOJIS.REVIEW);
    await guildData.updateTicket({ messageId: msg.id, channelId: channel.id });
  }
} exports.createMainMessage = createMainMessage;






 async function findTicketTypeArg(
  w,
  msg,
  args,
  argsHandler,
  checkIfAllClosed = true,
) {
  const guildData = await _index.guild.call(void 0, msg.guild.id);
  const ticketData = guildData.data.ticket;

  if (!ticketData || !ticketData.active) return 'desabilidado';
  if (!ticketData.tickets || ticketData.tickets.length === 0) return 'no-tickets';

  // check if exists ticket open
  if (checkIfAllClosed) {
    const allClosed = ticketData.tickets.every(x => x.closed);
    if (allClosed) return 'all-closed';
  }

  const hasRole = () => ticketData.role && msg.member.roles.has(ticketData.role);
  const hasPermission = () => !msg.member.permissions.has('ADMINISTRATOR') || hasRole();

  if (!w) {
    // check if channel is ticket channel
    const ticketChannel = ticketData.tickets.find(x => x.channelId === msg.channel.id);
    if (ticketChannel) {
      return { ticket: ticketChannel, guildData };
    }
    // check if user has ticket open
    const userTicket = ticketData.tickets.find(x => x.authorId === msg.author.id && !x.closed);
    if (userTicket) {
      return { ticket: userTicket, guildData };
    }
    // check if user has permission to manager ticket's
    if (hasPermission()) {
      return 'user-no-ticket';
    }
    return Promise.reject();
  }
  if (hasPermission()) return 'user-no-perm';
  const handler = (x) => {
    let r;
    try {
      r = argsHandler(x);
    } catch (_) {}
    if (r) return r(w, msg, args);
  };
  // check if that's user
  const channel = handler('textChannel');
  if (channel) {
    const find = ticketData.tickets.find(x => x.channelId === channel.id);
    if (find) return { ticket: find, guildData };
    return Promise.reject();
  }
  // check if that's user
  const member = handler('member');
  if (member) {
    const find = ticketData.tickets.find(x => x.authorId === member.user.id && !x.closed);
    if (find) return { ticket: find, guildData };
    return Promise.reject();
  }
  // check if that's ticket id
  const find = ticketData.tickets.find(x => x._id && x._id.equals(w));
  if (find) {
    return { ticket: find, guildData };
  }

  return Promise.reject();
} exports.findTicketTypeArg = findTicketTypeArg;
