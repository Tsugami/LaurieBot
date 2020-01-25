import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Configuration } from '../../categories';
import { guild } from '../../database';

type optionTypes = 'off' | 'on'
interface ArgsI {
  option: optionTypes,
}


class SetChannelPnCommand extends Command {
  constructor() {
    super('setchannelpn', {
      aliases: ['setchannelpn', 'setcanalpn'],
      userPermissions: 'MANAGE_GUILD',
      category: Configuration,
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: `digite **ON** para ativar e **OFF** para desativar as mensagens de punições nesse canal.`,
            retry: 'digite uma das opções corretamente.'
          }
        }
        ],
      defaultPrompt: {
        cancelWord: 'cancelar'
      }
    });
  }

  async exec (msg: Message, args: ArgsI) {
    const guildData = await guild(msg.guild.id)
    switch (args.option) {
      case 'off': {
        if (guildData.data.penaltyChannels.includes(msg.channel.id)) {
          return msg.reply('as mensagens de punições já estão desativados nesse canal.')
        }
        await guildData.removePenaltyChannel(msg.channel.id)
        return msg.reply('as mensagens de punições foram desativados nesse canal.')
      }
      case 'on': {
        if (!guildData.data.penaltyChannels.includes(msg.channel.id)) {
          return msg.reply('as mensagens de punições já estão ativados nesse canal.')
        }
        await guildData.addPenaltyChannel(msg.channel.id)
        return msg.reply('as mensagens de punições foram ativados nesse canal.')
      }
    }
  }
}

export default SetChannelPnCommand;
