import { Inhibitor } from 'discord-akairo';
import { guild } from '@database/index';
import Command from '@struct/Command';
import { Message } from 'discord.js';

export default class TicketInhibitor extends Inhibitor {
  constructor() {
    super('ticket', {
      reason: 'TicketInhibitor',
    });
  }

  async exec(msg: Message, command: Command) {
    if (command.category.id !== 'ticket') return;

    const guildData = await guild(msg.guild.id);
    const active = !guildData.data.ticket || guildData.data.ticket.active;

    if (command.id === 'ativar-tk' && active) return Promise.reject();
    if (!active) return Promise.reject();
  }
}
