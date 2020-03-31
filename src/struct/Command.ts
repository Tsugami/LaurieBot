import { Command, ArgumentPromptFunction } from 'discord-akairo';
import { Message, MessageOptions, Guild } from 'discord.js';
import { printError } from '@utils/Utils';
import i18next, { TFunction, TOptions } from 'i18next';
import { CustomCommandOptions } from './interfaces';
import categories from './categories';

export { TFunction } from 'i18next';

export type PrompFunc<A = any> = (t: TFunction, msg: Message, args: A, tries: number) => string | MessageOptions;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFixedT(msg: Message | Guild) {
  const language = 'pt-BR';
  return i18next.getFixedT(language);
}

export function Prompt(fn: string, options?: TOptions): (msg: Message) => string;
export function Prompt<A>(fn: PrompFunc<A>): ArgumentPromptFunction;
export function Prompt<B extends { option: string } | any>(
  fn: string | PrompFunc<B>,
  options: TOptions = {},
): ArgumentPromptFunction {
  if (typeof fn === 'string') return (msg: Message) => getFixedT(msg)(fn, options);
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
}

export default abstract class CustomCommand extends Command {
  help: string;

  constructor(id: string, options: CustomCommandOptions) {
    super(
      id,
      (msg: Message, args: any, edited: boolean) => {
        const t = getFixedT(msg);
        return this.run(msg, t, args, edited);
      },
      options,
    );
    this.help = options.help;
    categories[options.category].set(this.id, this);
  }

  abstract run(msg: Message, t: TFunction, args: any, edited: boolean): any | Promise<any>;

  toTitle(t: TFunction) {
    const args = i18next.exists(`commands:${this.id}.usage`)
      ? t(`commands:${this.id}.usage`)
          .replace(/(\[|<)/g, x => `${x}\``)
          .replace(/(\]|>)/g, x => `\`${x}`)
          .replace('|', '`|`')
      : '';
    return `**${this.help}** ${args}`;
  }

  getPrefix(msg: Message) {
    return this.client.commandHandler.prefix(msg);
  }

  printError(error: Error, message: Message) {
    return printError(error, this.client, message, this);
  }
}
