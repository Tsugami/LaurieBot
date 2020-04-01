import { Message } from 'discord.js';
import { ArgumentType, ArgumentOptions } from 'discord-akairo';

import Command, { Prompt, TFunction } from '@struct/Command';
import LaurieEmbed from '@struct/LaurieEmbed';

import { guild } from '@database/index';
import GuildController from '@database/controllers/GuildController';
import { CustomCommandOptions } from './interfaces';

export interface ModuleOptionArgs {
  guildData: GuildController;
}

interface Options<A, C = ModuleOptionArgs> {
  id: A;
  aliases: string[];
  validate: (m: Message, args: ModuleOptionArgs) => boolean;
  run(msg: Message, t: TFunction, args: C): any;
}

class ModuleCommand<A extends string> extends Command {
  private readonly title = `commands:${this.id}.title`;

  constructor(
    id: string,
    commandOptions: Partial<Omit<CustomCommandOptions, 'args' | 'category'>>,
    public moduleOptions: Options<A>[],
    dependArgs?: Record<string, [Exclude<ArgumentType, string[]>, A[], Partial<Omit<ArgumentOptions, 'id' | 'type'>>?]>,
  ) {
    super(id, {
      category: 'configuration',
      ...commandOptions,
      args: [
        {
          id: 'guildData',
          type: (_: string, msg: Message) => guild(msg.guild.id),
        },
        {
          id: 'option',
          type: (word, message, args) =>
            moduleOptions
              .filter(o => o.validate(message, args))
              .find((o, i) => Number(word) === i + 1 || word === String(o.id) || o.aliases.includes(word))?.id,
          prompt: {
            start: Prompt<ModuleOptionArgs>((t, m, a) => {
              const { author } = m;
              const embed = new LaurieEmbed(m.author);
              const optionsMessage = moduleOptions
                .filter(o => o.validate(m, a))
                .map((o, i) => {
                  return `**${i + 1}**: ${t(`commands:${this.id}.args.option.${o.id}`)}`;
                })
                .join('\n');

              embed.setDescription(
                `**${t(this.title).toUpperCase()}**\n\n${t('commons:choose_option', {
                  author,
                })}\n\n${optionsMessage}\n\n${t('commons:cancel_message')}`,
              );

              return { embed };
            }),
          },
        },
        ...(dependArgs
          ? Object.entries(dependArgs).reduce<ArgumentOptions[]>(
              (newArgs, [argId, [type, optionIds, argOptions = {}]]) => {
                newArgs.push({
                  ...argOptions,
                  id: argId,
                  type: (word, m, a) => {
                    const x = optionIds.find(o => String(a.option) === o);
                    if (x) {
                      return this.client.commandHandler.resolver.type(type)(word, m, a) || null;
                    }
                    return '';
                  },
                  prompt: {
                    start: Prompt<any>((t, _, a) => {
                      const x = optionIds.find(o => String(a.option) === o);
                      return t(`commands:${this.id}.args.${argId}.${x}`);
                    }),
                  },
                });
                return newArgs;
              },
              [],
            )
          : []),
      ],
    });
  }

  run(msg: Message, t: TFunction, args: any) {
    const type = this.moduleOptions.find(o => String(o.id) === String(args.option));
    if (type) return type.run(msg, t, args);
  }
}

export default ModuleCommand;
