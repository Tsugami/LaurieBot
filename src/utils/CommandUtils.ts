import { ArgumentPromptFunction } from 'discord-akairo';
import { Message, MessageOptions, Guild } from 'discord.js';
import i18next, { TFunction, TOptions } from 'i18next';
import { LaurieCommandOptions } from '@struct/command/interfaces';

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
  if (typeof fn === 'string') return (msg: Message) => `${msg.author.toString()}, ${getFixedT(msg)(fn, options)}`;
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
}

// eslint-disable-next-line no-nested-ternary
const defaultTrue = (o: any) => (o === undefined ? (o === null ? true : o) : o);
export function parseOptions<O extends LaurieCommandOptions>(id: string, options: O): O {
  if (options.args && defaultTrue(options.autoPrompt)) {
    options.args = options.args.map(arg => {
      if (!arg.prompt) arg.prompt = {};

      if (!arg.prompt.start) arg.prompt.start = Prompt(`commands:${id}.args.${arg.id}.start`);
      if (!arg.prompt.retry) arg.prompt.start = Prompt(`commands:${id}.args.${arg.id}.retry`);

      return arg;
    });
  }

  return options;
}

export function getPrefix(msg: Message) {
  return msg.client.commandHandler.prefix(msg);
}
