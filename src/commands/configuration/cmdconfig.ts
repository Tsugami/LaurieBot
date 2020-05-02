import ModuleCommand from '@structures/ModuleCommand';
import { Command } from 'discord-akairo';
import { TextChannel } from 'discord.js';

interface CmdArgs {
  command: Command;
}

interface ChannelArgs {
  channel: TextChannel;
}

export const COMMANDS_THAT_CANNOT_BE_DISABLED = ['help'];
export const CATEGORIES_THAT_CANNOT_BE_DISABLED = ['configuration'];

export default class CmdConfig extends ModuleCommand {
  constructor() {
    super(
      'cmdconfig',
      [
        {
          id: 'disable_command',
          async run(msg, guildData, { command }: CmdArgs) {
            if (COMMANDS_THAT_CANNOT_BE_DISABLED.some(cmd => cmd === command.id)) {
              return msg.reply(msg.t(`${this.tPath}.cannot_this_command_be_disable`));
            }

            if (CATEGORIES_THAT_CANNOT_BE_DISABLED.some(c => c === command.category.id)) {
              return msg.reply(
                msg.t('', {
                  categories: `\`${CATEGORIES_THAT_CANNOT_BE_DISABLED.map(category =>
                    msg.t(`categories:${category}`),
                  ).join(', ')}\``,
                }),
              );
            }

            if (guildData.disabledCommands.includes(command.id)) {
              return msg.reply(msg.t(`${this.tPath}.already_disabled_command`));
            }

            await guildData.disableCommand(command.id);
            msg.reply(msg.t(`${this.tPath}.disabled_command`, { commandName: command.id }));
          },
        },
        {
          id: 'enable_command',
          validate(_, guildData) {
            return guildData.disabledCommands.length > 0;
          },
          async run(msg, guildData, { command }: CmdArgs) {
            await guildData.enableCommands(command.id);
            msg.reply(msg.t('commands:cmdconfig.enabled_command', { command: msg.util?.parsed?.prefix + command.id }));
          },
        },
        {
          id: 'disable_channel',
          async run(msg, guildData, { channel }: ChannelArgs) {
            if (guildData.disabledChannels.includes(channel.id)) {
              return msg.reply(msg.t('commands:cmdconfig.already_disabled_channel'));
            }
            await guildData.disableChannel(channel.id);
            return msg.reply(msg.t('commands:cmdconfig.disabled_channel', { channel: `${channel}` }));
          },
        },
        {
          id: 'enable_channel',
          validate(_, guildData) {
            return guildData.disabledChannels.length > 0;
          },
          async run(msg, guildData, { channel }: ChannelArgs) {
            await guildData.enableChannel(channel.id);
            return msg.reply(msg.t('commands:cmdconfig.enabled_channel', { channel: `${channel}` }));
          },
        },
      ],
      [
        [['disable_command', 'enable_command'], { id: 'command', type: 'commandAlias' }],
        [['disable_channel', 'enable_channel'], { id: 'channel', type: 'textChannel' }],
      ],
      {
        aliases: ['configurarcmds'],
        userPermissions: ['ADMINISTRATOR'],
        channel: 'guild',
      },
      (embed, msg, guildData) => {
        embed.addField(
          msg.t('commands:cmdconfig.disabled_commands'),
          guildData.disabledCommands
            .filter(c => c)
            .map(c => `\`${c}\``)
            .join(', ') || msg.t('commands:cmdconfig.none_commands'),
        );
        embed.addField(
          msg.t('commands:cmdconfig.disabled_channels'),
          guildData.disabledChannels
            .filter(c => msg?.guild?.channels.cache.has(c))
            .map(id => msg?.guild?.channels.cache.get(id)?.toString())
            .join(', ') || msg.t('commands:cmdconfig.none_channels'),
        );
      },
    );
  }
}
