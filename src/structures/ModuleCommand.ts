/* eslint-disable no-restricted-syntax */
// /* eslint-disable no-restricted-syntax */
// /* eslint-disable guard-for-in */
// import LaurieCommand, { LaurieCommandOptions } from '@structures/LaurieCommand';
// import { Message, Guild, RichEmbed } from 'discord.js';
// import GuildController from '@database/controllers/GuildController';

// import LaurieEmbed from './LaurieEmbed';

// type modifyMessageOption = (embed: LaurieEmbed, msg: Message, guildData: GuildController) => LaurieEmbed;

// export default class ModuleCommand extends LaurieCommand {
//   optionsHandler = new ModuleOptionsHandler(this, this.optionsDirectory);

//   constructor(
//     id: string,
//     commandOptions: LaurieCommandOptions,
//     public optionsDirectory: string,
//     private modifyMessageOption?: modifyMessageOption,
//   ) {
//     super(id, commandOptions);
//     this.optionsHandler.loadAll();
//   }

//   async *args(message: Message) {
//     const guild = message.guild as Guild;
//     const { t } = message;
//     const guildData = await this.client.database.getGuild(guild.id);

//     const allOptions = this.moduleOptions.map(Option => new Option(this, message, guildData));
//     const enabledOptions = allOptions.filter(o => o.validate());
//     const optionsStr = this.optionsToString(message, allOptions, enabledOptions);

//     const option: number = yield {
//       type: this.optionArgumentTypeFn(enabledOptions),
//       prompt: {
//         start: this.optionPromptFn(t(this.tTitle).toUpperCase(), optionsStr, guildData),
//         retry: this.optionPromptFn(t(`modules:optionInvalid`), optionsStr, guildData),
//       },
//     };

//     const currentOption = enabledOptions[option];
//     const args = {};
//     if (currentOption.args) {
//       for (const arg of currentOption.args) {
//         const result = yield arg;
//         args[arg.id as string] = result;
//       }
//     }

//     return currentOption.run(args);
//   }

//   optionsToString({ t }: Message, allOptions: ModuleOptions[], enabledOptions: ModuleOptions[]) {
//     const optionsStr = [];
//     const parse = (option: ModuleOptions, index: any) => `**\`[${index}]\`** ${t(option.tPath)}`;
//     for (const option of allOptions) {
//       if (enabledOptions.some(o => o.id === option.id)) {
//         optionsStr.push(parse(option, enabledOptions.findIndex(o => o.id === option.id) + 1));
//       } else {
//         optionsStr.push(`~~${parse(option, 'X')}~~`);
//       }
//     }
//     return optionsStr.join('\n');
//   }

//   optionArgumentTypeFn(enabledOptions: ModuleOptions[]) {
//     return (msg: Message, input: string) => {
//       const result = enabledOptions.findIndex((o, i) => Number(input) === i + 1);
//       if (result >= 0) return result;
//       return null;
//     };
//   }

//   optionPromptFn(embedTitle: string, optionsStr: string, guildData: GuildController) {
//     return (msg: Message) => {
//       const embed = new LaurieEmbed(msg.author, embedTitle, `${optionsStr}\n\n${msg.t('commons:cancel_message')}`);

//       if (this.modifyMessageOption) this.modifyMessageOption(embed, msg, guildData);

//       return {
//         embed,
//         content: msg.t('commons:choose_option', {
//           author: msg.author.toString(),
//         }),
//       };
//     };
//   }

//   eslint-disable-next-line @typescript-eslint/no-empty-function
//   exec() {}
// }

import { Message, Guild } from 'discord.js';
import { ArgumentOptions } from 'discord-akairo';

import GuildController from '@database/controllers/GuildController';
import LaurieCommand, { LaurieCommandOptions } from './LaurieCommand';
import LaurieEmbed from './LaurieEmbed';

interface Options {
  id: string;
  validate?: (this: ModuleCommand, message: Message, guildData: GuildController) => boolean;
  run(this: ModuleCommand, message: Message, guildData: GuildController, args: any): any;
}

export default class ModuleCommand extends LaurieCommand {
  readonly dependArgs = new Map<string, ArgumentOptions[]>();

  constructor(
    id: string,
    public modules: Options[],
    dependArgs: [string[], ArgumentOptions][] = [],
    commandOptions: Partial<Omit<LaurieCommandOptions, 'category' | 'args' | 'editable'>> = {},
    public modifyMainEmbed?: (embed: LaurieEmbed, message: Message, guildData: GuildController) => any,
  ) {
    super(id, { ...commandOptions, category: 'configuration', editable: false });
    // eslint-disable-next-line no-restricted-syntax
    for (const a of dependArgs) {
      // eslint-disable-next-line no-restricted-syntax
      for (const i of a[0]) {
        const arg = a[1];
        if (!arg.prompt) {
          arg.prompt = {
            start: (m: Message) => m.t(`${this.tPath}.args.${arg.id}.${i}`),
            retry: (m: Message) => m.t(`${this.tPath}.args.${arg.id}.retry`),
          };
        }

        if (this.dependArgs.has(i)) {
          this.dependArgs.get(i)?.push(arg);
        } else {
          this.dependArgs.set(i, [arg]);
        }
      }
    }
  }

  async *args(message: Message) {
    const guild = message.guild as Guild;
    const { t } = message;
    const guildData = await this.client.database.getGuild(guild.id);

    const allOptions = this.modules;
    const enabledOptions = allOptions.filter(o => (o.validate ? o.validate.call(this, message, guildData) : true));
    const optionsStr = this.optionsToString(message, allOptions, enabledOptions);

    const option: number = yield {
      type: this.optionArgumentTypeFn(enabledOptions),
      prompt: {
        start: this.optionPromptFn(t(`commands:${this.id}.title`).toUpperCase(), optionsStr, guildData),
        retry: this.optionPromptFn(t(`modules:optionInvalid`), optionsStr, guildData),
      },
    };

    const currentOption = enabledOptions[option];
    const args = {};
    const dependArgs = this.dependArgs.get(currentOption.id);

    if (dependArgs) {
      for (const arg of dependArgs) {
        const result = yield arg;
        args[arg.id as string] = result;
      }
    }

    return currentOption.run.call(this, message, guildData, args);
  }

  optionsToString({ t }: Message, allOptions: Options[], enabledOptions: Options[]) {
    const optionsStr = [];
    const parse = (option: Options, i: any) => `**\`[${i}]\`** ${t(`${this.tPath}.args.option.${option.id}`)}`;
    for (const option of allOptions) {
      if (enabledOptions.some(o => o.id === option.id)) {
        optionsStr.push(parse(option, enabledOptions.findIndex(o => o.id === option.id) + 1));
      } else {
        optionsStr.push(`~~${parse(option, 'X')}~~`);
      }
    }
    return optionsStr.join('\n');
  }

  optionArgumentTypeFn(enabledOptions: Options[]) {
    return (msg: Message, input: string) => {
      const result = enabledOptions.findIndex((o, i) => Number(input) === i + 1);
      if (result >= 0) return result;
      return null;
    };
  }

  optionPromptFn(embedTitle: string, optionsStr: string, guildData: GuildController) {
    return (msg: Message) => {
      const embed = new LaurieEmbed(msg.author, embedTitle, `${optionsStr}\n\n${msg.t('commons:cancel_message')}`);

      if (this.modifyMainEmbed) this.modifyMainEmbed(embed, msg, guildData);

      return {
        embed,
        content: msg.t('commons:choose_option', {
          author: msg.author.toString(),
        }),
      };
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  exec() {}
}

// import { Prompt } from '@utils/CommandUtils';
// import LaurieEmbed from '@struct/LaurieEmbed';

// import { guild } from '@database/index';

// import { TFunction } from 'i18next';
// import { LaurieCommandOptions } from './interfaces';
// import { CustomArgumentOptions } from './interfaces/index';

// export interface ModuleOptionArgs {
//   guildData: GuildController;
// }

// export type DetailsFuncResult = Array<[string, string, boolean?]>;
// interface Options<A, C = ModuleOptionArgs> {
//   id: A;
//   validate: (m: Message, args: ModuleOptionArgs) => boolean;
//   run(msg: Message, t: TFunction, args: C): any;
// }

// export type ModuleArgTypes = Exclude<ArgumentType, string[]>;

// export default function createModuleCommand<A extends string>(
//   id: string,
//   commandOptions: Partial<Omit<LaurieCommandOptions, 'args' | 'category'>>,
//   moduleOptions: Options<A>[],
//   dependArgs?: Record<string, [ModuleArgTypes, A[], Partial<Omit<ArgumentOptions, 'id' | 'type'>>?]>,
//   detailsFunc?: (msg: Message, t: TFunction, args: ModuleOptionArgs) => DetailsFuncResult,
// ) {
//   const title = `commands:${id}.title`;
//   return new Command(
//     id,
//     {
//       category: 'configuration',
//       ...commandOptions,
//       autoPrompt: false,
//       args: [
//         {
//           id: 'guildData',
//           type: (_: string, msg: Message) => guild(msg.guild.id),
//         },
//         {
//           id: 'option',
//           type: (word, message, args) =>
//             moduleOptions
//               .filter(o => o.validate(message, args))
//               .find((o, i) => Number(word) === i + 1 || word === String(o.id))?.id,
//           prompt: {
//             start: Prompt<ModuleOptionArgs>((t, m, a) => {
//               const { author } = m;
//               const embed = new LaurieEmbed(m.author);
//               const optionsMessage = moduleOptions
//                 .filter(o => o.validate(m, a))
//                 .map((o, i) => {
//                   return `**[${i + 1}]** ${t(`commands:${id}.args.option.${o.id}`)}`;
//                 })
//                 .join('\n');

//               embed
//                 .setDescription(`**${t(title).toUpperCase()}**\n\n${optionsMessage}\n\n${t('commons:cancel_message')}`)
//                 .addFields(detailsFunc ? detailsFunc(m, t, a) : []);

//               return {
//                 embed,
//                 content: t('commons:choose_option', {
//                   author,
//                 }),
//               };
//             }),
//             retry: Prompt(`modules:optionInvalid`),
//           },
//         },
//         ...(dependArgs
//           ? Object.entries(dependArgs).reduce<CustomArgumentOptions[]>(
//               (newArgs, [argId, [type, optionIds, argOptions = {}]]) => {
//                 newArgs.push({
//                   ...argOptions,
//                   id: argId,
//                   type: (word, m, a) => {
//                     const x = optionIds.find(o => String(a.option) === o);
//                     if (x) {
//                       return m.client.commandHandler.resolver.type(type)(word, m, a) || null;
//                     }
//                     return '';
//                   },
//                   prompt: {
//                     start: Prompt<any>((t, m, a) => {
//                       const x = optionIds.find(o => String(a.option) === o);
//                       return `${m.author.toString()}, ${t(`commands:${id}.args.${argId}.${x}`)}`;
//                     }),
//                   },
//                 });
//                 return newArgs;
//               },
//               [],
//             )
//           : []),
//       ],
//     },
//     (msg, t, args) => {
//       const type = moduleOptions.find(o => String(o.id) === String(args.option));
//       if (type) return type.run(msg, t, args as ModuleOptionArgs);
//     },
//   );
// }
