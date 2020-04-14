import { ArgumentPromptFunction } from 'discord-akairo';
import { Message, MessageOptions, Guild } from 'discord.js';
import i18next, { TFunction, TOptions } from 'i18next';
import { LaurieCommandOptions } from '@struct/command/interfaces';
import LaurieEmbed from '@struct/LaurieEmbed';

export type PrompFunc<A = any> = (t: TFunction, msg: Message, args: A, tries: number) => string | MessageOptions;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFixedT(msg: Message | Guild) {
  const language = 'pt-BR';
  return i18next.getFixedT(language);
}

export function Prompt(fn: string, options?: TOptions | boolean, sendCancelMessage?: boolean): (msg: Message) => string;
export function Prompt<A>(fn: PrompFunc<A>): ArgumentPromptFunction;
export function Prompt<B extends { option: string } | any>(
  fn: string | PrompFunc<B>,
  options: TOptions | boolean = {},
  sendCancelMessage = true,
): ArgumentPromptFunction {
  if (typeof fn === 'string')
    return (msg: Message) => {
      const t = getFixedT(msg);
      const tOptions = typeof options === 'object' ? options : {};
      const cancelMessage = options === false || sendCancelMessage === false ? '' : `${t('commons:tryCancel')}`;
      return {
        content: msg.author.toString(),
        embed: new LaurieEmbed(msg.author, t(fn, tOptions), cancelMessage),
      };
    };
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
}

export function translationPrompt(tPath: string, tOptions?: TOptions) {
  return (m: Message) => getFixedT(m)(tPath, tOptions);
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
