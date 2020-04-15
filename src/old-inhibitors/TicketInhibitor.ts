import { Inhibitor, Command } from 'discord-akairo';
import { guild } from '@database/index';
import { Message } from 'discord.js';

export default class TicketInhibitor extends Inhibitor {
  constructor() {
    super('ticket', {
      reason: 'TicketInhibitor',
    });
  }

  async exec(msg: Message, command: Command) {
    if (command.id === 'ticket' || command.category.id !== 'ticket') return Promise.resolve();

    const guildData = await guild(msg.guild.id);
    const active = guildData.data.ticket && guildData.data.ticket.active;

    if (command.id === 'ativar-tk' && active) return Promise.reject();
    if (command.id !== 'ativar-tk' && !active) return Promise.reject();
  }
}