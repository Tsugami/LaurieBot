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

export type PrompFunc<A = any> = (t: TFunction, msg: Message, args: A, tries: number) => string;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFixedT(msg: Message) {
  const language = 'pt-BR';
  return i18next.getFixedT(language);
}

export function Prompt(fn: string, options?: TOptions): (msg: Message) => string;
export function Prompt<A>(fn: PrompFunc<A>): ArgumentPromptFunction;
export function Prompt<B extends { option: string } | any, C extends string>(
  fn: string | PrompFunc<B>,
  options: TOptions = {},
): ArgumentPromptFunction {
  if (typeof fn === 'string') return (msg: Message) => getFixedT(msg)(fn, options);
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
}

export function PromptOptions<T extends Record<any, string>, A extends { option: keyof T }>(
  options: T,
  tOptions: TOptions = {},
): (msg: Message, args: A) => string {
  return (msg, args) => getFixedT(msg)(options[args.option], tOptions);
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

const cancelOption: Option = {
  key: 'cancel',
  aliases: ['cancelar'],
  message: 'commons:cancel',
};

export const defineOptions = (options: Option[]) => [...options, cancelOption];
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
      if (typeof x[1] === 'string') return client.commandHandler.resolver.type(x[1])(...args) || null;
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

  const fillPromptEmpty = (key: 'retry' | 'timeout' | 'ended' | 'cancel') => {
    if (!promptOptions[key]) promptOptions[key] = Prompt(`commons:prompt_options_default.${key}`);
  };

  fillPromptEmpty('retry');
  fillPromptEmpty('timeout');
  fillPromptEmpty('ended');
  fillPromptEmpty('cancel');

  return {
    id,
    type: (word, m, a) => {
      const option = optionsParsed(m, a).find(
        (x, i) => Number(word) === i + 1 || word === x.key || x.aliases.includes(word),
      );
      if (option) return option.key;
      return null;
    },
    prompt: {
      ...promptOptions,
      start: (m, a, t) =>
        `${title(m, a, t)}\n${optionsParsed(m, a)
          .map((o, i) => {
            return `**${i + 1}**: ${typeof o.message === 'string' ? Prompt(o.message)(m) : o.message(m, a)}`;
          })
          .join('\n')}`,
    },
  };
}
