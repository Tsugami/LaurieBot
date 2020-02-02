import { Message } from 'discord.js';
import Command from '@struct/Command';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { Emojis } from '@utils/Constants';

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'discord',
      help: 'ping',
    });
  }

  async run(msg: Message) {
    const sent = await msg.channel.send('Pong!');
    if (Array.isArray(sent)) return;

    const timeDiff = Number(sent.editedAt || sent.createdAt) - Number(msg.editedAt || msg.createdAt);

    const text = new Text()
      .addField(Emojis.RTT, 'RTT', `${timeDiff} ms`)
      .addField(Emojis.HEARTBEAT, 'Heartbeat', `${Math.round(this.client.ping)} ms`);
    sent.edit(`${Emojis.PING_PONG} Pong!`, new Embed(msg.author).setDescription(text));
  }
}

module.exports = PingCommand;
