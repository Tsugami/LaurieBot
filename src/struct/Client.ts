import { buildi18n } from '@config/i18next';
import { AkairoClient } from 'discord-akairo';

export default class Client extends AkairoClient {
  constructor() {
    super(
      {
        listenerDirectory: 'src/events',
        commandDirectory: 'src/commands',
        inhibitorDirectory: 'src/inhibitors',
        prefix: process.env.BOT_PREFIX || '!',
      },
      {},
    );
  }

  async login(token: string) {
    await buildi18n();
    return super.login(token);
  }
}
