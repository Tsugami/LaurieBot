"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordjs = require('discord.js');


 async function deleteAllHandler(guildData, guild) {
  const ticketConfig = guildData.data.ticket;

  const tkChannel = guild.channels.get(ticketConfig.channelId);
  if (tkChannel instanceof _discordjs.TextChannel && ticketConfig.messageId) {
    const message = await tkChannel.fetchMessage(ticketConfig.messageId).catch(() => null);
    if (message) message.delete();
  }

  const tickets = ticketConfig && ticketConfig.tickets;
  if (tickets && tickets.length) {
    tickets.forEach(tk => {
      const tkchannel = guild.channels.get(tk.channelId);
      if (tkchannel instanceof _discordjs.TextChannel) tkchannel.delete();
    });
  }
  guildData.deleteTicketModule();
} exports.default = deleteAllHandler;
