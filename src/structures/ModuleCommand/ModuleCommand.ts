/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import LaurieCommand, { LaurieCommandOptions } from '@structures/LaurieCommand';
import { Message, Guild } from 'discord.js';
import GuildController from '@database/controllers/GuildController';

import { AkairoHandler } from 'discord-akairo';
import LaurieEmbed from '../LaurieEmbed';
import ModuleOptions from './Option';
import ModuleOptionsHandler from './OptionsHandler';

type modifyMessageOption = (embed: LaurieEmbed, msg: Message, guildData: GuildController) => LaurieEmbed;

export default class ModuleCommand extends LaurieCommand {
  optionsHandler = new ModuleOptionsHandler(this, this.optionsDirectory);

  constructor(
    id: string,
    commandOptions: LaurieCommandOptions,
    public optionsDirectory: string,
    private modifyMessageOption?: modifyMessageOption,
  ) {
    super(id, commandOptions);
    this.optionsHandler.loadAll();
  }

  // async *args(message: Message) {
  //   const guild = message.guild as Guild;
  //   const { t } = message;
  //   const guildData = await this.client.database.getGuild(guild.id);

  //   const allOptions = this.moduleOptions.map(Option => new Option(this, message, guildData));
  //   const enabledOptions = allOptions.filter(o => o.validate());
  //   const optionsStr = this.optionsToString(message, allOptions, enabledOptions);

  //   const option: number = yield {
  //     type: this.optionArgumentTypeFn(enabledOptions),
  //     prompt: {
  //       start: this.optionPromptFn(t(this.tTitle).toUpperCase(), optionsStr, guildData),
  //       retry: this.optionPromptFn(t(`modules:optionInvalid`), optionsStr, guildData),
  //     },
  //   };

  //   const currentOption = enabledOptions[option];
  //   const args = {};
  //   if (currentOption.args) {
  //     for (const arg of currentOption.args) {
  //       const result = yield arg;
  //       args[arg.id as string] = result;
  //     }
  //   }

  //   return currentOption.run(args);
  // }

  // optionsToString({ t }: Message, allOptions: ModuleOptions[], enabledOptions: ModuleOptions[]) {
  //   const optionsStr = [];
  //   const parse = (option: ModuleOptions, index: any) => `**\`[${index}]\`** ${t(option.tPath)}`;
  //   for (const option of allOptions) {
  //     if (enabledOptions.some(o => o.id === option.id)) {
  //       optionsStr.push(parse(option, enabledOptions.findIndex(o => o.id === option.id) + 1));
  //     } else {
  //       optionsStr.push(`~~${parse(option, 'X')}~~`);
  //     }
  //   }
  //   return optionsStr.join('\n');
  // }

  // optionArgumentTypeFn(enabledOptions: ModuleOptions[]) {
  //   return (msg: Message, input: string) => {
  //     const result = enabledOptions.findIndex((o, i) => Number(input) === i + 1);
  //     if (result >= 0) return result;
  //     return null;
  //   };
  // }

  // optionPromptFn(embedTitle: string, optionsStr: string, guildData: GuildController) {
  //   return (msg: Message) => {
  //     const embed = new LaurieEmbed(msg.author, embedTitle, `${optionsStr}\n\n${msg.t('commons:cancel_message')}`);

  //     if (this.modifyMessageOption) this.modifyMessageOption(embed, msg, guildData);

  //     return {
  //       embed,
  //       content: msg.t('commons:choose_option', {
  //         author: msg.author.toString(),
  //       }),
  //     };
  //   };
  // }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  exec() {}
}
