/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import LaurieCommand from '@structures/LaurieCommand';
import { PermissionString, Message, Guild, MessageOptions } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import { ArgumentOptions } from 'discord-akairo';

import LaurieEmbed from './LaurieEmbed';

export interface ModuleCommandOptions {
  aliases?: string[];
  userPermissions: PermissionString[];
  clientPermissions: PermissionString[];
}

export interface ModuleOptions {
  validate(msg: Message, guildData: GuildController): boolean | Promise<boolean>;
  run(this: ModuleCommand, msg: Message, guildData: GuildController, args: any): any;
  args?: ArgumentOptions[];
}

export type detailFunc = (embed: LaurieEmbed, msg: Message, guildData: GuildController) => LaurieEmbed;
export default class ModuleCommand extends LaurieCommand {
  private tTitle = `${this.tPath}.title`;

  constructor(
    id: string,
    commandOptions: ModuleCommandOptions,
    private moduleOptions: Record<string, ModuleOptions>,
    private details?: detailFunc,
  ) {
    super(id, { ...commandOptions, category: 'configuration', editable: false, lock: 'guild' });
    this.moduleOptions = moduleOptions;
    this.details = details;

    if (!this.locales.exists(this.tTitle)) {
      this.logger.error('MODULE_COMMAND: NÃO DEFINIU O TITULO DAS OPÇÕES NOS LOCALES', this.tTitle);
    }

    for (const moduleId in moduleOptions) {
      const optionTPath = `${this.tPath}.args.option.${moduleId}`;

      if (!this.locales.exists(optionTPath)) {
        this.logger.error(`MODULE_COMMAND: DESCRIÇÃO DA OPÇÃO NÃO FOI DENIDA NOS LOCALES`, optionTPath);
      }
    }
  }

  async *args(message: Message) {
    const guild = message.guild as Guild;
    const { t } = message;
    const guildData = await this.client.database.getGuild(guild.id);
    const moduleEntries = Object.entries(this.moduleOptions);
    const moduleOptions = moduleEntries.filter(o => o[1].validate(message, guildData));

    const option: ArgumentOptions | [string, ModuleOptions] = yield {
      type: (msg: Message, input: string) => moduleOptions.find((o, i) => Number(input) === i + 1 || input === o[0]),
      prompt: {
        start: (msg: Message): MessageOptions => {
          const embed = new LaurieEmbed(msg.author);
          const optionsMessage = moduleOptions
            .map((o, i) => {
              return `**[${i + 1}]** ${t(`${this.tPath}.args.option.${o[0]}`)}`;
            })
            .join('\n');

          embed.setDescription(
            `**${t(this.tTitle).toUpperCase()}**\n\n${optionsMessage}\n\n${t('commons:cancel_message')}`,
          );

          if (this.details) this.details(embed, msg, guildData);

          return {
            embed,
            content: t('commons:choose_option', {
              author: msg.author.toString(),
            }),
          };
        },
        retry: t(`modules:optionInvalid`),
      },
    };

    const currentOption = this.moduleOptions[(option as [string, ModuleOptions])[0]];
    const args = {};
    if (currentOption.args) {
      for (const arg of currentOption.args) {
        const result = yield arg;
        args[arg.id as string] = result;
      }
    }

    return currentOption.run.apply(this, [message, guildData, args]);
  }
}

export interface ModuleArgumentOptions {
  command: LaurieCommand;
  msg: Message;
  title: string;
  details?: detailFunc;
  guildData: GuildController;
}

export function ModuleArgument(
  moduleOptions: readonly string[] | string[],
  { command, msg: { t }, title, details, guildData }: ModuleArgumentOptions,
) {
  return {
    type: (msg: Message, input: string) => moduleOptions.find((o, i) => Number(input) === i + 1),
    prompt: {
      start: (msg: Message) => {
        const optionsMessage = (moduleOptions as string[])
          .map((o, i) => {
            return `**\`[${i + 1}]\`** ${t(`${command.tPath}.args.option.${o}`)}`;
          })
          .join('\n');

        const embed = new LaurieEmbed(msg.author)
          .setTitle(title)
          .setDescription(`${optionsMessage}\n\n${t('commons:cancel_message')}`);

        if (details) details(embed, msg, guildData);

        return {
          embed,
          content: t('commons:choose_option', {
            author: msg.author.toString(),
          }),
        };
      },
      retry: t(`modules:optionInvalid`),
    },
  };
}
