import { Message } from 'discord.js';

import Command, { Prompt, TFunction } from '@struct/Command';
import { guild } from '@database/index';

interface ArgsI {
  option: 'off' | 'on';
}

const prompt = {
  onOption: 'ON',
  offOption: 'OFF',
};

class CommandsCommand extends Command {
  constructor() {
    super('commands', {
      aliases: ['comandos', 'desativar'],
      userPermissions: 'MANAGE_MESSAGES',
      category: 'configuration',
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: Prompt('commands:commands.args.option.start', prompt),
            retry: Prompt('commands:commands.args.option.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
      },
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const guildData = await guild(msg.guild.id);
    if (args.option === 'off') {
      if (guildData.data.disableChannels.includes(msg.channel.id)) {
        return msg.reply(t('commands:commands.off_option.already_disabled'));
      }
      await guildData.disableChannel(msg.channel.id);
      return msg.reply(t('commands:commands.off_option.disabled'));
    }

    if (!guildData.data.disableChannels.includes(msg.channel.id)) {
      return msg.reply(t('commands:commands.on_option.already_enabled'));
    }

    await guildData.enableChannel(msg.channel.id);
    return msg.reply(t('commands:commands.on_option.enabled'));
  }
}

export default CommandsCommand;
