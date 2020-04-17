/* eslint-disable @typescript-eslint/camelcase */
import { ModuleArgument } from '@structures/ModuleCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message, Guild } from 'discord.js';

// import ModuleCommand, { ModuleOptionArgs } from '@struct/command/ModuleCommand';
import { ArgumentOptions, Argument, Command } from 'discord-akairo';
// import Categories from '@struct/command/categories';
// import { TextChannel } from 'discord.js';
// import HelpCommand from '../bot/help';
// import { getPrefix } from '../../utils/CommandUtils';
import LaurieCommand from '@structures/LaurieCommand';

export const COMMANDS_THAT_CANNOT_BE_DISABLED = ['help'];
export const CATEGORIES_THAT_CANNOT_BE_DISABLED = ['configuration'];

export default class CommandConfig extends LaurieCommand {
  constructor() {
    super('cmdconfig', {
      aliases: ['configurarcmds'],
      userPermissions: ['ADMINISTRATOR'],
      clientPermissions: ['MANAGE_MESSAGES'],
      editable: false,
      category: 'configuration',
    });
  }

  async *args(msg: Message) {
    const guild = msg.guild as Guild;
    const guildData = await this.client.database.getGuild(guild.id);
    const options = ['disable_command'] as const;

    const selected: typeof options[number] = yield ModuleArgument(options, {
      msg,
      title: msg.t('commands:cmdconfig.title').toUpperCase(),
      command: this,
      guildData,
    });

    if (selected === 'disable_command') {
      const filter = (c: Command) => {
        return (
          !guildData.disabledCommands.includes(c.id) &&
          !CATEGORIES_THAT_CANNOT_BE_DISABLED.includes(c.categoryID) &&
          !COMMANDS_THAT_CANNOT_BE_DISABLED.includes(c.id)
        );
      };

      const commandsEnabled = this.client.commandHandler.modules.filter(filter);
      const commandsStr = commandsEnabled.map(c => `\`${c.help}\``).join(', ');
      const commandArg: ArgumentOptions = {
        type: Argument.validate('commandAlias', (c, p, v) => v && filter(v as Command)),
        prompt: {
          start: (m: Message) =>
            new LaurieEmbed(msg.author, m.t(`${this.tPath}.args.command.disable_command`), commandsStr),
          retry: (m: Message, { phrase }: { phrase: string }) => {
            const command = this.client.commandHandler.findCommand(phrase);
            if (!command) {
              return m.t(`${this.tPath}.args.command.retry`);
            }
            if (COMMANDS_THAT_CANNOT_BE_DISABLED.includes(command.id)) {
              return m.t(`${this.tPath}.cannot_this_command_be_disable`);
            }
            if (guildData.disabledCommands.includes(command.id)) {
              return m.t(`${this.tPath}.already_disabled_command`);
            }
            if (CATEGORIES_THAT_CANNOT_BE_DISABLED.includes(command.categoryID)) {
              return m.t(`${this.tPath}.categories_that_cannot_be_disabled`);
            }
          },
        },
      };
      const command: LaurieCommand = yield commandArg;
      await guildData.disableCommand(command.id);
      return msg.reply(new LaurieEmbed(msg.author, msg.t(`${this.tPath}.disabled_command`, { command: command.help })));
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  exec() {}
}

// const validate = () => true;
// export default class CommandConfig extends ModuleCommand {
//   constructor() {
//     super(
//       'cmdconfig',
//       {
//         aliases: ['configurarcmds'],
//         userPermissions: ['ADMINISTRATOR'],
//         clientPermissions: ['MANAGE_MESSAGES'],
//       },
//       {
//         disable_command: {
//           validate,
//           args: [{
//             id: 'command',
//             prompt: {
//               start: m => m.t(this.tPath + this.args + )
//           } } ]
//           async run(msg, guildData, { command }: { command: LaurieCommand }) {
//             if (COMMANDS_THAT_CANNOT_BE_DISABLED.some(cmd => cmd === command.id)) {
//               return msg.reply(msg.t('commands:cmdconfig.cannot_this_command_be_disable'));
//             }

//             if (CATEGORIES_THAT_CANNOT_BE_DISABLED.some(category => category === command.category.id)) {
//               return msg.reply(
//                 msg.t('categories_that_cannot_be_disabled', {
//                   categories: `\`${CATEGORIES_THAT_CANNOT_BE_DISABLED.map(category =>
//                     msg.t(`categories:${category}`),
//                   ).join(', ')}\``,
//                 }),
//               );
//             }

//             if (guildData.disabledCommands.includes(command.id)) {
//               return msg.reply(msg.t('commands:cmdconfig.already_disabled_command'));
//             }

//             await guildData.disableCommand(command.id);
//             msg.reply(msg.t('commands:cmdconfig.disable_command', { commandName: command.id }));
//           },
// },
//     {
//       id: 'enable_command',
//       validate,
//       async run(msg, t, { guildData, command }: CmdArgs) {
//         await guildData.enableCommands(command.id);
//         msg.reply(msg.t('commands:cmdconfig.enabled_command', { command: getPrefix(msg) + command.id }));
//       },
//     },
//     {
//       id: 'disable_channel',
//       validate,
//       async run(msg, t, { guildData, channel }: ChannelArgs) {
//         if (guildData.disabledChannels.includes(channel.id)) {
//           return msg.reply(t('commands:cmdconfig.already_disabled_channel'));
//         }
//         await guildData.disableChannel(channel.id);
//         return msg.reply(t('commands:cmdconfig.disabled_channel', { channel: channel.toString() }));
//       },
//     },
//     {
//       id: 'enable_channel',
//       validate,
//       async run(msg, t, { guildData, channel }: ChannelArgs) {
//         await guildData.enableChannel(channel.id);
//         return msg.reply(t('commands:cmdconfig.enabled_channel', { channel: channel.toString() }));
//       },
//         //     },
//       },
//       (embed, { t, guild }, { disabledChannels, disabledCommands }) => {
//         const commands = disabledCommands.map(c => `\`${c}\``).join(', ') || t('commands:cmdconfig.none_commands');
//         embed.addField(t('commands:cmdconfig.disabled_commands'), commands);

//         embed.addField(
//           t('commands:cmdconfig.disabled_channels'),
//           disabledChannels.map(id => guild?.channels.cache.get(id)?.toString() ?? id).join(', ') ||
//             t('commands:cmdconfig.none_channels'),
//         );

//         return embed;
//       },
//     );
//   }
// }

// // interface CmdArgs extends ModuleOptionArgs {
// //   command: Command;
// // }

// interface ChannelArgs extends ModuleOptionArgs {
//   channel: TextChannel;
// }

// export const COMMANDS_THAT_CANNOT_BE_DISABLED = [HelpCommand];
// export const CATEGORIES_THAT_CANNOT_BE_DISABLED = [Categories.configuration];

// const validate = () => true;
// export default ModuleCommand(
//   'cmdconfig',
//   { aliases: ['configurarcmds'], userPermissions: ['ADMINISTRATOR'], channelRestriction: 'guild' },
//   [
//     {
//       id: 'disable_command',
//       validate,
//       async run(msg, t, { guildData, command }: CmdArgs) {
//         if (COMMANDS_THAT_CANNOT_BE_DISABLED.some(cmd => cmd.id === command.id)) {
//           return msg.reply(t('commands:cmdconfig.cannot_this_command_be_disable'));
//         }

//         if (CATEGORIES_THAT_CANNOT_BE_DISABLED.some(category => category.id === command.category.id)) {
//           return msg.reply(
//             t('', {
//               categories: `\`${CATEGORIES_THAT_CANNOT_BE_DISABLED.map(category => t(`categories:${category.id}`)).join(
//                 ', ',
//               )}\``,
//             }),
//           );
//         }

//         if (guildData.disabledCommands.includes(command.id)) {
//           return msg.reply(t('commands:cmdconfig.already_disabled_command'));
//         }

//         await guildData.disableCommand(command.id);
//         msg.reply(t('commands:cmdconfig.disable_command', { commandName: command.id }));
//       },
//     },
//     {
//       id: 'enable_command',
//       validate,
//       async run(msg, t, { guildData, command }: CmdArgs) {
//         await guildData.enableCommands(command.id);
//         msg.reply(t('commands:cmdconfig.enabled_command', { command: getPrefix(msg) + command.id }));
//       },
//     },
//     {
//       id: 'disable_channel',
//       validate,
//       async run(msg, t, { guildData, channel }: ChannelArgs) {
//         if (guildData.disabledChannels.includes(channel.id)) {
//           return msg.reply(t('commands:cmdconfig.already_disabled_channel'));
//         }
//         await guildData.disableChannel(channel.id);
//         return msg.reply(t('commands:cmdconfig.disabled_channel', { channel: channel.toString() }));
//       },
//     },
//     {
//       id: 'enable_channel',
//       validate,
//       async run(msg, t, { guildData, channel }: ChannelArgs) {
//         await guildData.enableChannel(channel.id);
//         return msg.reply(t('commands:cmdconfig.enabled_channel', { channel: channel.toString() }));
//       },
//     },
//   ],
//   {
//     command: ['commandAlias', ['disable_command', 'enable_command']],
//     channel: ['textChannel', ['disable_channel', 'enable_channel']],
//   },
//   (m, t, { guildData }) => {
//     return [
//       [
//         t('commands:cmdconfig.disabled_commands'),
//         guildData.disabledCommands.map(c => `\`${c}\``).join(', ') || t('commands:cmdconfig.none_commands'),
//       ],
//       [
//         t('commands:cmdconfig.disabled_channels'),
//         guildData.disabledChannels.map(id => m.guild.channels.get(id)?.toString() || id).join(', ') ||
//           t('commands:cmdconfig.none_channels'),
//       ],
//     ];
//   },
// );
// // class CommandsCommand extends Command {
// //   constructor() {
// //     super('commands', {
// //       aliases: ['comandos', 'desativar'],
// //       userPermissions: 'MANAGE_MESSAGES',
// //       category: 'configuration',
// //       channelRestriction: 'guild',
// //       args: [
// //         {
// //           id: 'option',
// //           type: ['on', 'off'],
// //           prompt: {
// //             start: Prompt('commands:commands.args.option.start', prompt),
// //             retry: Prompt('commands:commands.args.option.retry'),
// //           },
// //         },
// //       ],
// //       defaultPrompt: {
// //         cancelWord: 'cancelar',
// //       },
// //     });
// //   }

// //   async run(msg: Message, t: TFunction, args: ArgsI) {
// //     const guildData = await guild(msg.guild.id);
// //     if (args.option === 'off') {
// //       if (guildData.data.disableChannels.includes(msg.channel.id)) {
// //         return msg.reply(t('commands:commands.off_option.already_disabled'));
// //       }
// //       await guildData.disableChannel(msg.channel.id);
// //       return msg.reply(t('commands:commands.off_option.disabled'));
// //     }

// //     if (!guildData.data.disableChannels.includes(msg.channel.id)) {
// //       return msg.reply(t('commands:commands.on_option.already_enabled'));
// //     }

// //     await guildData.enableChannel(msg.channel.id);
// //     return msg.reply(t('commands:commands.on_option.enabled'));
// //   }
// // }

// // export default CommandsCommand;
