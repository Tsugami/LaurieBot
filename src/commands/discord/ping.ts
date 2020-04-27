import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';

export default class Ping extends LaurieCommand {
  constructor() {
    super('ping', {
      category: 'discord',
      aliases: ['pong'],
      editable: false,
    });
  }

  async exec(msg: Message) {
    const pingOrpong = msg.util?.parsed?.alias === 'ping' ? 'Pong!' : 'Ping!';
    const sent = (await msg.channel.send(pingOrpong)) as Message;

    const timeDiff = Number(sent.editedAt || sent.createdAt) - Number(msg.editedAt || msg.createdAt);

    sent.edit(
      new LaurieEmbed(msg.author).addInfoText(
        'PING_PONG',
        pingOrpong,
        ['RTT', 'RTT', `${timeDiff} ms`],
        ['HEARTBEAT', 'Heartbeat', `${Math.round(this.client.ws.ping)} ms`],
      ),
    );
  }
}
