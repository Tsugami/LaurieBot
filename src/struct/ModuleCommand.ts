import { Message } from 'discord.js';
import { ArgumentType, ArgumentOptions } from 'discord-akairo';

import Command, { Prompt, TFunction } from '@struct/Command';
import Embed from '@utils/Embed';

import { guild } from '@database/index';
import { CustomCommandOptions } from './interfaces';

type OptionFn = (m: Message, args: any) => boolean;

interface Options {
  id: string;
  aliases: string[];
  message: string | OptionFn;
  validate: OptionFn;
  run: (msg: Message, t: TFunction, args: any) => any;
}

class ModuleCommand extends Command {
  constructor(
    id: string,
    help: string,
    title: string,
    commandOptions: Partial<Omit<CustomCommandOptions, 'args' | 'category'>>,
    public moduleOptions: Options[],
    dependArgs?: Record<string, [Exclude<ArgumentType, string[]>, string[]]>,
  ) {
    super(id, {
      category: 'configuration',
      help,
      ...commandOptions,
      args: [
        {
          id: 'guildData',
          type: (_: string, msg: Message) => guild(msg.guild.id),
        },
        {
          id: 'option',
          type: (word, message, args) =>
            moduleOptions.find(
              (o, i) =>
                o.validate(message, args) && (Number(word) === i + 1 || word === o.id || o.aliases.includes(word)),
            )?.id,
          prompt: {
            start: Prompt((t, m, a) => {
              const { author } = m;
              const embed = new Embed(m.author);
              const optionsMessage = moduleOptions
                .filter(o => o.validate(m, a))
                .map((o, i) => {
                  return `**${i + 1}**: ${typeof o.message === 'string' ? Prompt(o.message)(m) : o.message(m, a)}`;
                })
                .join('\n');

              embed.setDescription(
                `**${t(title).toUpperCase()}**\n\n${t('commons:choose_option', {
                  author,
                })}\n\n${optionsMessage}\n\n${t('commons:cancel_message')}`,
              );

              return { embed };
            }),
          },
        },
        ...(dependArgs
          ? Object.entries(dependArgs).reduce<ArgumentOptions[]>((newArgs, [argId, [type, optionIds]]) => {
              newArgs.push({
                id: argId,
                type: (word, m, a) => {
                  const x = optionIds.find(o => (Array.isArray(o[0]) && o[0].includes(argId)) || o[0] === argId);
                  if (x) {
                    if (typeof type === 'string')
                      return this.client.commandHandler.resolver.type(type)(word, m, a) || null;
                  }
                  return '';
                },
              });
              return newArgs;
            }, [])
          : []),
      ],
    });
  }

  run(msg: Message, t: TFunction, args: any) {
    const type = this.moduleOptions.find(o => o.id === String(args.option));
    if (type) return type.run(msg, t, args);
  }
}

export default ModuleCommand;
