import { Listener } from 'discord-akairo';
import { ActivityType } from 'discord.js';
import { Emojis } from '@utils/Constants';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      eventName: 'ready',
    });
  }

  exec() {
    const {
      user,
      guilds,
      users,
      akairoOptions: { prefix },
    } = this.client;

    console.table({
      name: user.username,
      servers: guilds.size,
      users: users.size,
      prefix,
    });

    const statusTypes: Array<[string, ActivityType]> = [
      [`Amor para ${users.size} membros.`, 'STREAMING'],
      [`${Emojis.HEART} Use: ${prefix}ajuda ${Emojis.HEART}`, 'PLAYING'],
    ];
    const STREAMING_URL = 'https://www.twitch.tv/rellowtf2';

    const updateStatus = () => {
      const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
      user.setActivity(status[0], { type: status[1], url: status[1] === 'STREAMING' ? STREAMING_URL : undefined });
    };

    updateStatus();
    setInterval(updateStatus, 2 * 60000);
  }
}
