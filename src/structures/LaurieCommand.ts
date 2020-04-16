import { Command, CommandOptions } from 'discord-akairo';
import { exists, TFunction } from '@utils/locales';
import logger from '@utils/logger';

export type LaurieCategories =
  | 'discord'
  | 'bot'
  | 'interactivity'
  | 'minecraft'
  | 'moderator'
  | 'configuration'
  | 'ticket';

export interface LaurieCommandOptions extends CommandOptions {
  category: LaurieCategories;
}

declare module 'discord-akairo' {
  interface Command {
    help: string;
    logger: typeof logger;
    examples?: string;
    usage?: string;
    getTitle: (t: TFunction) => string;
  }
}

class LaurieCommand extends Command {
  constructor(id: string, options: LaurieCommandOptions) {
    super(id, options);

    this.logger = logger.scope(id);
    this.help = this.aliases[0] || id;
    this.aliases = [id, ...this.aliases];

    if (exists(`commands:${id}.description`)) {
      this.description = `commands:${id}.description`;
    } else {
      this.logger.warn(`command not have description in locales.`);
    }

    if (exists(`commands:${id}.examples`)) {
      this.examples = `commands:${id}.examples`;
    }

    if (exists(`commands:${id}.usage`)) {
      this.usage = `commands:${id}.usage`;
    }

    if (Array.isArray(this.clientPermissions)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of this.clientPermissions) {
        this.client.requiredPermissions.push(p);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  getTitle(t: TFunction) {
    const args = this.usage
      ? t(this.usage)
          .replace(/(\[|<)/g, x => `${x}\``)
          .replace(/(\]|>)/g, x => `\`${x}`)
          .replace('|', '`|`')
      : '';
    return `**${this.help}** ${args}`;
  }
}

export default LaurieCommand;
