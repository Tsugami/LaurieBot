/* eslint-disable no-console */
import { Listener } from 'discord-akairo';
import { ActivityType } from 'discord.js';
import { EMOJIS } from '@utils/constants';
import logger from '@utils/logger';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  exec() {
    const { user, guilds, users } = this.client;
    const { prefix: pfx } = this.client.commandHandler;
    // eslint-disable-next-line no-nested-ternary
    const prefix = typeof pfx === 'string' ? pfx : Array.isArray(pfx) ? pfx[0] : '';

    logger.success(
      `my name is ${user?.username}, i am operating for ${guilds.cache.size} servers and ${users.cache.size} users. my prefix is ${prefix}`,
    );

    const statusTypes: Array<[string, ActivityType]> = [
      [`Amor para ${users.cache.size} membros.`, 'STREAMING'],
      [`${EMOJIS.HEART} Use: ${prefix}ajuda ${EMOJIS.HEART}`, 'PLAYING'],
    ];
    const STREAMING_URL = 'https://www.twitch.tv/rellowtf2';

    const updateStatus = async () => {
      const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
      await user?.setActivity(status[0], {
        type: status[1],
        url: status[1] === 'STREAMING' ? STREAMING_URL : undefined,
      });
      logger.warn(`changed status for: ${status[0]}`);
    };

    updateStatus();
    this.client.setInterval(updateStatus, 2 * 60000);
  }
}
