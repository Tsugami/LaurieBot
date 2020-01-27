import { Guild, TextChannel } from 'discord.js';
import GuildController from '@database/controllers/GuildController';

export default async function deleteAllHandler(guildData: GuildController, guild: Guild) {
  const ticketConfig = guildData.data.ticket;

  const tkChannel = guild.channels.get(ticketConfig.channelId);
  if (tkChannel instanceof TextChannel && ticketConfig.messageId) {
    const message = await tkChannel.fetchMessage(ticketConfig.messageId).catch(() => null);
    if (message) message.delete();
  }

  const tickets = ticketConfig && ticketConfig.tickets;
  if (tickets && tickets.length) {
    tickets.forEach(tk => {
      const tkchannel = guild.channels.get(tk.channelId);
      if (tkchannel instanceof TextChannel) tkchannel.delete();
    });
  }
  guildData.deleteTicketModule();
}
