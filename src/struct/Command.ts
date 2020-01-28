import {
  Command,
  CommandOptions,
  ArgumentPromptFunction,
  ArgumentOptions,
  ArgumentTypeFunction,
  ArgumentPromptOptions,
  AkairoClient,
  ArgumentType,
} from 'discord-akairo';
import { Message } from 'discord.js';
import i18next, { TFunction, TOptions } from 'i18next';
import { guild } from 'database';
import categories from './categories';

export type TFunction = TFunction;

export interface CustomCommandOptions extends CommandOptions {
  category: keyof typeof categories;
}

export type PrompFunc<A = any> = (t: TFunction, msg: Message, args: A, tries: number) => any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFixedT(msg: Message) {
  const language = 'pt-BR';
  return i18next.getFixedT(language);
}

export function Prompt<A = any>(fn: string | PrompFunc<A>, options: TOptions = {}): ArgumentPromptFunction {
  if (typeof fn === 'string') return msg => getFixedT(msg)(fn, options);
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
}

export default abstract class CustomCommand extends Command {
  constructor(id: string, options: CustomCommandOptions) {
    super(id, { ...options });
  }

  abstract run(msg: Message, t: TFunction, args: any, edited: boolean): any | Promise<any>;

  exec(msg: Message, args: any, edited: boolean) {
    const t = getFixedT(msg);
    return this.run(msg, t, args, edited);
  }
}
// guild data argument
export const guildDataArg: ArgumentOptions = {
  id: 'guildData',
  type: (_: string, msg: Message) => guild(msg.guild.id),
};
// options argument
type OptionFunc = (m: Message, args: any) => boolean;
type Option = {
  key: string;
  message: string | OptionFunc;
  aliases: string[];
  parse?: OptionFunc;
};

export const defineOptions = (options: Option[]) => options;
export type Keys<options extends Option[]> = options[number]['key'];

export type optionType<T> = [T | T[], ArgumentType];
export function getArgumentAkairo<T extends string>(
  client: AkairoClient,
  key: T,
  options: optionType<T>[],
  defaultR: any = '',
): ArgumentTypeFunction {
  return (...args) => {
    const x = options.find(o => (Array.isArray(o[0]) && o[0].includes(key)) || o[0] === key);
    if (x) {
      if (typeof x[1] === 'string') return client.commandHandler.resolver.type(x[1])(...args);
    }
    return defaultR;
  };
}

export function optionsArg(
  id: string,
  options: Option[],
  title: ArgumentPromptFunction,
  promptOptions: ArgumentPromptOptions = {},
): ArgumentOptions {
  const optionsParsed = (m: Message, a: any): Option[] => options.filter(o => !o.parse || o.parse(m, a));

  return {
    id,
    type: (word, m, a) => {
      const option = optionsParsed(m, a).find(
        (x, i) => Number(word) === i + 1 || word === x.key || x.aliases.includes(word),
      );
      if (option) return option.key;
    },
    prompt: {
      ...promptOptions,
      start: (m, a, t) =>
        `${title(m, a, t)}\n${optionsParsed(m, a)
          .map((o, i) => {
            return `**${i + 1}**: ${typeof o.message === 'string' ? o.message : o.message(m, a)}`;
          })
          .join('\n')}`,
    },
  };
}
