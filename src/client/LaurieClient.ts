import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, PromptContentModifier } from 'discord-akairo';
import { CategoryChannel, PermissionString, Message } from 'discord.js';
import { join } from 'path';
import * as locales from '@utils/locales';
import logger from '@utils/logger';
import LaurieEmbed from '../structures/LaurieEmbed';
import Database from '../database/index';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    inhibitorHandler: InhibitorHandler;
    listenerHandler: ListenerHandler;
    locales: typeof locales;
    logger: typeof logger;
    requiredPermissions: PermissionString[];
    database: Database;
  }
}

class LaurieClient extends AkairoClient {
  constructor() {
    super({ disableMentions: 'everyone' });
    this.requiredPermissions = [];

    const modifyToEmbed = (addCancel: boolean): PromptContentModifier => {
      return (m, text: any) => {
        if (typeof text === 'string') {
          const cancelMessage = addCancel ? `\n\n${m.t('commons:tryCancel')}` : '';
          return new LaurieEmbed(m.author, text, cancelMessage);
        }
        if (text instanceof LaurieEmbed) {
          return { content: m.author.toString(), embed: text };
        }
        return text;
      };
    };

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: process.env.BOT_PREFIX || ';',
      commandUtil: true,
      handleEdits: true,
      argumentDefaults: {
        prompt: {
          cancel: (m: Message) => m.t('commons:prompt_options_default.cancel'),
          timeout: (m: Message) => m.t('commons:prompt_options_default.timeout'),
          ended: (m: Message) => m.t('commons:prompt_options_default.ended'),
          modifyStart: modifyToEmbed(true),
          modifyRetry: modifyToEmbed(true),
          modifyCancel: modifyToEmbed(false),
          modifyEnded: modifyToEmbed(false),
          modifyTimeout: modifyToEmbed(false),
        },
      },
    });

    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, '..', 'inhibitors'),
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners'),
    });

    this.locales = locales;
    this.logger = logger.scope(this.constructor.name);
    this.database = new Database();
  }

  async init(): Promise<this> {
    this.addTypes();
    await this.database.init();
    await this.locales.loadAll();

    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      inhibitorHandler: this.inhibitorHandler,
      listenerHandler: this.listenerHandler,
    });

    this.inhibitorHandler.loadAll();
    this.commandHandler.loadAll();

    this.pushRequiredPermissions();
    this.listenerHandler.loadAll();

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

  private pushRequiredPermissions() {
    this.requiredPermissions = this.commandHandler.modules.reduce<PermissionString[]>((prev, command) => {
      if (typeof command.clientPermissions === 'string' && !prev.includes(command.clientPermissions)) {
        prev.push(command.clientPermissions);
      } else if (Array.isArray(command.clientPermissions)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const permission of command.clientPermissions) {
          prev.push(permission as PermissionString);
        }
      }
      return prev;
    }, []);
    this.logger.success('permissions added:', this.requiredPermissions);
  }
}
export default LaurieClient;
