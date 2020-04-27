import { Inhibitor, Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TicketInhibitor extends Inhibitor {
  constructor() {
    super('ticket', {
      reason: 'ticket',
    });
  }

  async exec(msg: Message, command: Command) {
    if (command.categoryID !== 'ticket') return false;
    if (!msg.guild) return true;
    const guildData = await this.client.database.getGuild(msg.guild.id);
    return !guildData.ticket.active;
  }
}
