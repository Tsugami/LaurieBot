import { Message } from 'discord.js';
import Command from '@struct/Command';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'discord',
    });
  }

  async run(message: Message) {
    const sent = await message.channel.send('Pong!');
    if (Array.isArray(sent)) return;

    const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
    const text = `🔂\u2000**RTT**: ${timeDiff} ms\n💟\u2000**Heartbeat**: ${Math.round(this.client.ping)} ms`;
    sent.edit(`Pong!\n${text}`);
  }
}

module.exports = PingCommand;
