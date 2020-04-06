import { Message } from 'discord.js';
import { ArgumentType, ArgumentOptions } from 'discord-akairo';

import Command from '@struct/command/Command';
import { Prompt } from '@utils/CommandUtils';
import LaurieEmbed from '@struct/LaurieEmbed';

import { guild } from '@database/index';
import GuildController from '@database/controllers/GuildController';

import { TFunction } from 'i18next';
import { LaurieCommandOptions } from './interfaces';
import { CustomArgumentOptions } from './interfaces/index';

export interface ModuleOptionArgs {
  guildData: GuildController;
}

export type DetailsFuncResult = Array<[string, string, boolean?]>;
interface Options<A, C = ModuleOptionArgs> {
  id: A;
  validate: (m: Message, args: ModuleOptionArgs) => boolean;
  run(msg: Message, t: TFunction, args: C): any;
}

export default function createModuleCommand<A extends string>(
  id: string,
  commandOptions: Partial<Omit<LaurieCommandOptions, 'args' | 'category'>>,
  moduleOptions: Options<A>[],
  dependArgs?: Record<string, [Exclude<ArgumentType, string[]>, A[], Partial<Omit<ArgumentOptions, 'id' | 'type'>>?]>,
  detailsFunc?: (msg: Message, t: TFunction, args: ModuleOptionArgs) => DetailsFuncResult,
) {
  const title = `commands:${id}.title`;
  return new Command(
    id,
    {
      category: 'configuration',
      ...commandOptions,
      autoPrompt: false,
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
              .find((o, i) => Number(word) === i + 1 || word === String(o.id))?.id,
          prompt: {
            start: Prompt<ModuleOptionArgs>((t, m, a) => {
              const { author } = m;
              const embed = new LaurieEmbed(m.author);
              const optionsMessage = moduleOptions
                .filter(o => o.validate(m, a))
                .map((o, i) => {
                  return `**[${i + 1}]** ${t(`commands:${id}.args.option.${o.id}`)}`;
                })
                .join('\n');

              embed
                .setDescription(`**${t(title).toUpperCase()}**\n\n${optionsMessage}\n\n${t('commons:cancel_message')}`)
                .addFields(detailsFunc ? detailsFunc(m, t, a) : []);

              return {
                embed,
                content: t('commons:choose_option', {
                  author,
                }),
              };
            }),
          },
        },
        ...(dependArgs
          ? Object.entries(dependArgs).reduce<CustomArgumentOptions[]>(
              (newArgs, [argId, [type, optionIds, argOptions = {}]]) => {
                newArgs.push({
                  ...argOptions,
                  id: argId,
                  type: (word, m, a) => {
                    const x = optionIds.find(o => String(a.option) === o);
                    if (x) {
                      return m.client.commandHandler.resolver.type(type)(word, m, a) || null;
                    }
                    return '';
                  },
                  prompt: {
                    start: Prompt<any>((t, m, a) => {
                      const x = optionIds.find(o => String(a.option) === o);
                      return `${m.author.toString()}, ${t(`commands:${id}.args.${argId}.${x}`)}`;
                    }),
                  },
                });
                return newArgs;
              },
              [],
            )
          : []),
      ],
    },
    (msg, t, args) => {
      const type = moduleOptions.find(o => String(o.id) === String(args.option));
      if (type) return type.run(msg, t, args as ModuleOptionArgs);
    },
  );
}
