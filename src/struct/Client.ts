import { buildi18n } from '@config/i18next';
import { AkairoClient } from 'discord-akairo';
import path from 'path';
import { Prompt } from '@struct/Command';

const mainFolder = __filename.endsWith('ts') ? 'src' : 'dist';

export default class Client extends AkairoClient {
  constructor() {
    super(
      {
        listenerDirectory: path.resolve(mainFolder, 'events'),
        commandDirectory: path.resolve(mainFolder, 'commands'),
        inhibitorDirectory: path.resolve(mainFolder, 'inhibitors'),
        prefix: process.env.BOT_PREFIX || '!',
        defaultPrompt: {
          cancel: Prompt(`commons:prompt_options_default.cancel`),
          start: Prompt(`commons:prompt_options_default.start`),
          retry: Prompt(`commons:prompt_options_default.retry`),
          timeout: Prompt(`commons:prompt_options_default.timeout`),
          cancelWord: 'cancel',
        },
      },
      {},
    );
  }

  async login(token: string) {
    await buildi18n();
    return super.login(token);
  }
}
