import { buildi18n } from '@config/i18next';
import { AkairoClient, CommandHandler } from 'discord-akairo';
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
        prefix: process.env.BOT_PREFIX || ';',
        defaultPrompt: {
          cancel: Prompt(`commons:prompt_options_default.cancel`, false),
          ended: Prompt('commons:prompt_options_default.ended', false),
          timeout: Prompt(`commons:prompt_options_default.timeout`, false),
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
    this.commandHandler.resolver.addType('categoryChannel', (text, m) => {
      if (m.channel.type !== 'text') return;
      const { channels } = m.guild;
      return channels.find(channel => {
        if (channel instanceof CategoryChannel) {
          if (channel.id === text) return true;

          const reg = /<#(\d+)>/;
          const match = text.match(reg);

          if (match && channel.id === match[1]) return true;

          text = text.toLowerCase();
          const name = channel.name.toLowerCase();
          return name === text || name === text.replace(/^#/, '');
        }
        return false;
      });
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
  interface Client {
    commandHandler: CommandHandler;
  }
}
