import { Command, CommandOptions } from 'discord-akairo';
import { exists } from '@utils/locales';
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

    if (Array.isArray(this.clientPermissions)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const p of this.clientPermissions) {
        this.client.requiredPermissions.push(p);
      }
    }
  }
}

export default LaurieCommand;
