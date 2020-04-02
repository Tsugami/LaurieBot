import { buildi18n } from '@config/i18next';
import { AkairoClient } from 'discord-akairo';
import { CategoryChannel } from 'discord.js';
import path from 'path';
import { Prompt } from '@utils/CommandUtils';

const mainFolder = __filename.endsWith('ts') ? 'src' : 'dist';

export default class LaurieClient extends AkairoClient {
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
          ended: Prompt('commons:prompt_options_default.ended'),
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

  build() {
    super.build();
    this.addTypes();
    return this;
  }

  addTypes() {
    this.commandHandler.resolver.addType('categoryChannel', (w, m, a) => {
      const channel = this.commandHandler.resolver.type('channel')(w, m, a);
      if (channel instanceof CategoryChannel) return channel;
      return null;
    });
  }
}

declare module 'discord.js' {
  interface Command {
    client: Client;
  }
  interface Listener {
    client: Client;
  }
}
