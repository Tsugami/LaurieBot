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
    super(id, { ...commandOptions, category: 'configuration', editable: false, lock: 'guild' });

    for (const a of dependArgs) {
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
