/* eslint-disable no-underscore-dangle */
import { Command, ArgumentTypeFunction } from 'discord-akairo';
import { Message } from 'discord.js';
import { printError } from '@utils/Utils';
import { getFixedT, parseOptions } from '@utils/CommandUtils';
import i18next, { TFunction } from 'i18next';
import categories from './categories';

import { LaurieCommandOptions, LaurieArgType, ArgsTypes } from './interfaces';

export default class LaurieCommand<
  O extends LaurieCommandOptions,
  ArgsOption extends NonNullable<O['args']>,
  Arg extends ArgsOption[number],
  ArgType extends Arg['type'],
  Args extends {
    [K in Arg['id']]: ArgType extends ArgumentTypeFunction
      ? ReturnType<ArgType>
      : ArgType extends LaurieArgType
      ? ArgsTypes[ArgType]
      : any;
  }
> extends Command {
  constructor(
    id: string,
    options: O,
    public run: (
      this: LaurieCommand<O, ArgsOption, Arg, ArgType, Args>,
      message: Message,
      t: TFunction,
      args: Args,
      edited?: boolean,
    ) => any,
  ) {
    super(
      id,
      (msg: Message, args: Args, edited: boolean) => {
        const t = getFixedT(msg);
        this.run.call(this, msg, t, args, edited);
      },
      parseOptions(id, options),
    );

    this.aliases = [...(options.aliases || []), id].filter((x, i, a) => a.indexOf(x) === i);
    this.category = categories[options.category];

    this.category.set(this.id, this);
  }

  toTitle(t: TFunction) {
    const args = i18next.exists(`commands:${this.id}.usage`)
      ? t(`commands:${this.id}.usage`)
          .replace(/(\[|<)/g, x => `${x}\``)
          .replace(/(\]|>)/g, x => `\`${x}`)
          .replace('|', '`|`')
      : '';
    return `**${this.aliases[0]}** ${args}`;
  }

  getPrefix(msg: Message) {
    return this.client.commandHandler.prefix(msg);
  }

  printError(error: Error, message: Message) {
    return printError(error, this.client, message, this);
  }
}
