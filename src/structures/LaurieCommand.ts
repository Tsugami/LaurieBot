import { Command, CommandOptions } from 'discord-akairo';
import { PermissionString } from 'discord.js';
import * as locales from '@utils/locales';
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
  editable: boolean;
  clientPermissions?: PermissionString[] | PermissionString;
  userPermissions?: PermissionString[] | PermissionString;
}

declare module 'discord-akairo' {
  interface Command {
    help: string;
    logger: typeof logger;
    locales: typeof locales;
    examples?: string;
    usage?: string;
    getTitle: (t: locales.TFunction) => string;
    tPath: string;
  }
}

class LaurieCommand extends Command {
  constructor(id: string, options: LaurieCommandOptions, autoAlias = true) {
    super(id, options);

    this.tPath = `commands:${id.replace('-', '_')}`;
    this.logger = logger.scope(id);
    this.locales = locales;
    this.help = this.aliases[0] || id;
    if (autoAlias) this.aliases = [id, ...this.aliases];
    if (locales.exists(`${this.tPath}.description`)) {
      this.description = `${this.tPath}.description`;
    } else {
      this.logger.warn(`command not have description in locales.`);
    }

    if (locales.exists(`${this.tPath}.examples`)) {
      this.examples = `${this.tPath}.examples`;
    }

    if (locales.exists(`${this.tPath}.usage`)) {
      this.usage = `${this.tPath}.usage`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  getTitle(t: TFunction) {
    const args = this.usage
      ? t(this.usage)
          .replace(/(\[|<)/g, (x: string) => `${x}\``)
          .replace(/(\]|>)/g, (x: string) => `\`${x}`)
          .replace('|', '`|`')
      : '';
    return `**${this.help}** ${args}`;
  }
}

export default LaurieCommand;
