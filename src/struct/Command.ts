/* eslint-disable no-underscore-dangle */
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { printError } from '@utils/Utils';
import { getFixedT } from '@utils/CommandUtils';
import i18next, { TFunction } from 'i18next';
import categories from './categories';

import { LaurieCommandOptions, ArgsTypes } from './interfaces/Command';

export default class LaurieCommand<
  Options extends LaurieCommandOptions,
  ArgsOption extends NonNullable<Options['args']>,
  Arg extends ArgsOption[number],
  Args extends Record<Arg['id'], ArgsTypes[Arg['type']]>
> extends Command {
  constructor(
    id: string,
    options: Options,
    public run: (message: Message, t: TFunction, args: Args, edited?: boolean) => any,
  ) {
    super(
      id,
      (msg: Message, args: Args, edited: boolean) => {
        const t = getFixedT(msg);
        this.run(msg, t, args, edited);
      },
      options,
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
