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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    description: {
      content: string;
      examples?: string;
    };
  }
}

class LaurieCommand extends Command {
  constructor(id: string, options: LaurieCommandOptions) {
    super(id, options);
    this.help = this.aliases[0] || id;
    this.aliases = [id, ...this.aliases];
    this.description = {};

    if (exists(`commands:${id}.description`)) {
      this.description.content = `commands:${id}.description`;
    } else {
      logger.warn(`${id} command not have description in locales.`);
    }

    if (exists(`commands:${id}.examples`)) {
      this.description.examples = `commands:${id}.examples`;
    }

    this.logger = logger;
  }
}

export default LaurieCommand;
