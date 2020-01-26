import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Configuration } from '@categories';
import { guild } from '@database/index';

interface ArgsI {
  option: 'off' | 'on',
}


class CommandsCommand extends Command {
  constructor() {
    super('commands', {
      aliases: ['commands', 'comandos', 'desativar'],
      userPermissions: 'MANAGE_MESSAGES',
      category: Configuration,
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: `digite **ON** para ativar e **OFF** para desativar os comandos desse canal.`,
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
        if (guildData.data.disableChannels.includes(msg.channel.id)) {
          return msg.reply('os comandos já estão desativados nesse canal.')
        }
        await guildData.disableChannel(msg.channel.id)
        return msg.reply('os comandos foram desativados nesse canal.')
      }
      case 'on': {
        if (!guildData.data.disableChannels.includes(msg.channel.id)) {
          return msg.reply('os comandos já estão ativados nesse canal.')
        }
        await guildData.enableChannel(msg.channel.id)
        return msg.reply('os comandos foram ativados nesse canal.')
      }
    }
  }
}

export default CommandsCommand;
