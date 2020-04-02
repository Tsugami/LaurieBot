import Command from '@struct/Command';
import LaurieEmbed from '@struct/LaurieEmbed';

export default new Command(
  'ping',
  {
    aliases: ['pong'],
    category: 'discord',
  },
  async msg => {
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
  },
);
