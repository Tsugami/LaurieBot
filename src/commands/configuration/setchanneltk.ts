import { Command, f } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

import { Configuration } from '../../categories';
import { guild } from '../../database';

type Option<K extends string> = {
  key: K,
  message: string,
  aliases: string[]
}
const defineOptions = <K extends string>(options: Option<K>[]) => options;

const options = defineOptions([
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'Ativar Ticket\'s'
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'Desativar Ticket\'s'
  },
  {
    key: 'channel',
    aliases: ['canal', 'alterar channel'],
    message: 'Alterar canal principal.'
  },
  {
    key: 'cancel',
    aliases: ['cancelar'],
    message: 'Cancelar'
  }
]);

type Keys = (typeof options)[number]["key"];

interface ArgsI {
  option: Keys,
  channel: TextChannel
}

class SetChannelTkCommand extends Command {
  constructor() {
    super('setcanaltk', {
      aliases: ['setcanaltk'],
      userPermissions: 'MANAGE_MESSAGES',
      category: Configuration,
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: (w) => {
            const x = options.find((x, i) => Number(w) === (i + 1) || w === x.key || x.aliases.includes(w))
            if (x) return x.key
          },
          prompt: {
            start: '\n' + options.map((o, i) => `**${i + 1}**: ${o.message}`).join('\n'),
            retry: 'digite uma das opções corretamente.'
          }
        }, {
          id: 'channel',
          type: (w, _, args: ArgsI) => {
            return args.option === 'channel' ? 'textChannel' : ''
          },
          prompt: {
            start: 'digite pra qual canal de texto você quer alterar.',
            retry: 'digite canal de texto corretamente.'
          }
        }
        ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      }
    });
  }

  async exec (msg: Message, args: ArgsI) {
    if (args.option === 'cancel') {
      return msg.reply('comando cancelado.')
    }

    const guildData = await guild(msg.guild.id)
    switch (args.option) {
      case 'enable': {
        if (guildData.data.ticket && guildData.data.ticket.active) {
          return msg.reply('os ticket\'s já estão ativos.')
        }
        await guildData.updateTicket({ active: true, channelId: msg.channel.id })
        return msg.reply('os  ticket\' foram ativados nesse canal.')
      }
      case 'disable': {
        if (!guildData.data.ticket || !guildData.data.ticket.active) {
          return msg.reply('os ticket\'s já estão desativado.')
        }
        await guildData.updateTicket({ active: true, channelId: msg.channel.id })
        return msg.reply('os  ticket\'s foram desativados nesse canal.')
      }
      case 'channel': {
        if (!guildData.data.ticket || !guildData.data.ticket.active) {
          return msg.reply('não é necessario alterar o canal com os ticket\'s estão desativados.')
        }
        console.log(args.channel, 'channel certo')
      }
    }
  }
}

export default SetChannelTkCommand;
