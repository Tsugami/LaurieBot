import { Message } from 'discord.js';
import Command from '@struct/Command';
import LaurieEmbed from '@struct/LaurieEmbed';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['pong'],
      category: 'discord',
    });
  }

  async run(msg: Message) {
    const sent = await msg.channel.send('Pong!');
    if (Array.isArray(sent)) return;

    const timeDiff = Number(sent.editedAt || sent.createdAt) - Number(msg.editedAt || msg.createdAt);

    sent.edit(
      new LaurieEmbed(msg.author).addInfoText(
        'PING_PONG',
        'Pong!',
        ['RTT', 'RTT', `${timeDiff} ms`],
        ['HEARTBEAT', 'Heartbeat', `${Math.round(this.client.ping)} ms`],
      ),
    );
  }
}

module.exports = PingCommand;
