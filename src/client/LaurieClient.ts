import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { CategoryChannel, PermissionResolvable } from 'discord.js';
import { join } from 'path';
import * as locales from '@utils/locales';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    inhibitorHandler: InhibitorHandler;
    listenerHandler: ListenerHandler;
    locales: typeof locales;
    requiredPermissions: PermissionResolvable[];
  }
}

class LaurieClient extends AkairoClient {
  constructor() {
    super({ disableMentions: 'all' });
    this.requiredPermissions = [];
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: process.env.BOT_PREFIX || ';',
      commandUtil: true,
      handleEdits: true,
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, '..', 'inhibitors'),
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners'),
    });

    this.locales = locales;
  }

  async init(): Promise<this> {
    this.addTypes();
    await this.locales.loadAll();

    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.inhibitorHandler.loadAll();
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();

    return this;
  }

  async start(token: string) {
    await this.init();
    return this.login(token);
  }

  addTypes() {
    this.commandHandler.resolver.addType('categoryChannel', (message, phrase) => {
      if (!message.guild) return;
      const { channels } = message.guild;
      return channels.cache.find(channel => {
        if (channel instanceof CategoryChannel) {
          if (channel.id === phrase) return true;

          const reg = /<#(\d+)>/;
          const match = phrase.match(reg);

          if (match && channel.id === match[1]) return true;

          phrase = phrase.toLowerCase();
          const name = channel.name.toLowerCase();
          return name === phrase || name === phrase.replace(/^#/, '');
        }
        return false;
      });
    });
  }

  generateInvite() {
    return super.generateInvite(this.requiredPermissions);
  }
}

export default LaurieClient;
