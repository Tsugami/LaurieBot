import ModuleCommand, { ModuleOptionArgs } from '@struct/command/ModuleCommand';
import { Command } from 'discord-akairo';
import Categories from '@struct/command/categories';
import { TextChannel } from 'discord.js';
import HelpCommand from '../bot/help';
import { getPrefix } from '../../utils/CommandUtils';

interface CmdArgs extends ModuleOptionArgs {
  command: Command;
}

interface ChannelArgs extends ModuleOptionArgs {
  channel: TextChannel;
}

export const COMMANDS_THAT_CANNOT_BE_DISABLED = [HelpCommand];
export const CATEGORIES_THAT_CANNOT_BE_DISABLED = [Categories.configuration];

const validate = () => true;
export default ModuleCommand(
  'cmdconfig',
  { aliases: ['configurarcmds'], userPermissions: ['ADMINISTRATOR'], channelRestriction: 'guild' },
  [
    {
      id: 'disable_command',
      validate,
      async run(msg, t, { guildData, command }: CmdArgs) {
        if (COMMANDS_THAT_CANNOT_BE_DISABLED.some(cmd => cmd.id === command.id)) {
          return msg.reply(t('commands:cmdconfig.cannot_this_command_be_disable'));
        }

        if (CATEGORIES_THAT_CANNOT_BE_DISABLED.some(category => category.id === command.category.id)) {
          return msg.reply(
            t('', {
              categories: `\`${CATEGORIES_THAT_CANNOT_BE_DISABLED.map(category => t(`categories:${category.id}`)).join(
                ', ',
              )}\``,
            }),
          );
        }

        if (guildData.disabledCommands.includes(command.id)) {
          return msg.reply(t('commands:cmdconfig.already_disabled_command'));
        }

        await guildData.disableCommand(command.id);
        msg.reply(t('commands:cmdconfig.disable_command', { commandName: command.id }));
      },
    },
    {
      id: 'enable_command',
      validate,
      async run(msg, t, { guildData, command }: CmdArgs) {
        await guildData.enableCommands(command.id);
        msg.reply(t('commands:cmdconfig.enabled_command', { command: getPrefix(msg) + command.id }));
      },
    },
    {
      id: 'disable_channel',
      validate,
      async run(msg, t, { guildData, channel }: ChannelArgs) {
        if (guildData.disabledChannels.includes(channel.id)) {
          return msg.reply(t('commands:cmdconfig.already_disabled_channel'));
        }
        await guildData.disableChannel(channel.id);
        return msg.reply(t('commands:cmdconfig.disabled_channel', { channel: channel.toString() }));
      },
    },
    {
      id: 'enable_channel',
      validate,
      async run(msg, t, { guildData, channel }: ChannelArgs) {
        await guildData.enableChannel(channel.id);
        return msg.reply(t('commands:cmdconfig.enabled_channel', { channel: channel.toString() }));
      },
    },
  ],
  {
    command: ['commandAlias', ['disable_command', 'enable_command']],
    channel: ['textChannel', ['disable_channel', 'enable_channel']],
  },
  (m, t, { guildData }) => {
    return [
      [
        t('commands:cmdconfig.disabled_commands'),
        guildData.disabledCommands.map(c => `\`${c}\``).join(', ') || t('commands:cmdconfig.none_commands'),
      ],
      [
        t('commands:cmdconfig.disabled_channels'),
        guildData.disabledChannels.map(id => m.guild.channels.get(id)?.toString() || id).join(', ') ||
          t('commands:cmdconfig.none_channels'),
      ],
    ];
  },
);
// class CommandsCommand extends Command {
//   constructor() {
//     super('commands', {
//       aliases: ['comandos', 'desativar'],
//       userPermissions: 'MANAGE_MESSAGES',
//       category: 'configuration',
//       channelRestriction: 'guild',
//       args: [
//         {
//           id: 'option',
//           type: ['on', 'off'],
//           prompt: {
//             start: Prompt('commands:commands.args.option.start', prompt),
//             retry: Prompt('commands:commands.args.option.retry'),
//           },
//         },
//       ],
//       defaultPrompt: {
//         cancelWord: 'cancelar',
//       },
//     });
//   }

//   async run(msg: Message, t: TFunction, args: ArgsI) {
//     const guildData = await guild(msg.guild.id);
//     if (args.option === 'off') {
//       if (guildData.data.disableChannels.includes(msg.channel.id)) {
//         return msg.reply(t('commands:commands.off_option.already_disabled'));
//       }
//       await guildData.disableChannel(msg.channel.id);
//       return msg.reply(t('commands:commands.off_option.disabled'));
//     }

//     if (!guildData.data.disableChannels.includes(msg.channel.id)) {
//       return msg.reply(t('commands:commands.on_option.already_enabled'));
//     }

//     await guildData.enableChannel(msg.channel.id);
//     return msg.reply(t('commands:commands.on_option.enabled'));
//   }
// }

// export default CommandsCommand;
