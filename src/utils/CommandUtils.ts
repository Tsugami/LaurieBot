import { ArgumentPromptFunction } from 'discord-akairo';
import { Message, MessageOptions, Guild } from 'discord.js';
import i18next, { TFunction, TOptions } from 'i18next';

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
