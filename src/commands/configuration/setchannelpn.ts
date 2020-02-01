import { Message } from 'discord.js';

import { guild } from '@database/index';
import Command, { Prompt, TFunction } from '@struct/Command';

type optionTypes = 'off' | 'on';
interface ArgsI {
  option: optionTypes;
}

const prompt = {
  onOption: 'ON',
  offOption: 'OFF',
};

class SetChannelPnCommand extends Command {
  constructor() {
    super('setchannelpn', {
      aliases: ['setchannelpn', 'setcanalpn', 'configurarpn'],
      userPermissions: 'MANAGE_GUILD',
      channelRestriction: 'guild',
      category: 'configuration',
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: Prompt('commands:setchannelpn.args.option.start', prompt),
            retry: Prompt('commands:setchannelpn.args.option.retry'),
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
      if (guildData.data.penaltyChannels.includes(msg.channel.id)) {
        return msg.reply(t('commands:setchannelpn.off_option.already_disabled'));
      }
      await guildData.removePenaltyChannel(msg.channel.id);
      return msg.reply(t('commands:setchannelpn.off_option.disabled'));
    }
    if (!guildData.data.penaltyChannels.includes(msg.channel.id)) {
      return msg.reply(t('commands:setchannelpn.on_option.already_enabled'));
    }
    await guildData.addPenaltyChannel(msg.channel.id);
    return msg.reply(t('commands:setchannelpn.on_option.enabled'));
  }
}

export default SetChannelPnCommand;
