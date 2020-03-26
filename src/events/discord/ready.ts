import { Listener } from 'discord-akairo';
import { ActivityType } from 'discord.js';

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
      ['Amor', 'STREAMING'],
      [`${prefix}help`, 'PLAYING'],
    ];
    const STREAMING_URL = 'https://www.twitch.tv/rellowtf2';

    let currentStatus = 0;

    const updateStatus = () => {
      const status = statusTypes[currentStatus];
      user.setActivity(status[0], { type: status[1], url: status[1] === 'STREAMING' ? STREAMING_URL : '' });
      if (currentStatus === statusTypes.length - 1) currentStatus = 0;
      else currentStatus += 1;
    };

    updateStatus();
    setInterval(updateStatus, 2 * 60000);
  }
}
