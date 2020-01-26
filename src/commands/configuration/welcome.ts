import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Configuration } from '@categories';
import { guild } from '@database/index';

type optionTypes = 'alterar' | 'ativar' | 'desativar' | 'cancelar'
interface ArgsI {
  option: optionTypes,
  message: string
}

interface OptionI {
  aliases: string[],
  message: string,
  key: optionTypes,
}

const options: OptionI[] = [
  {
    key: 'alterar',
    aliases: ['alterar', 'change'],
    message: 'Alterar mensagem de boas vindas.'
  },
  {
    key: 'ativar',
    aliases: ['ativar', 'on'],
    message: 'Ativar mensagem de boas vindas.'
  },
  {
    key: 'desativar',
    aliases: ['desativar', 'change', 'off'],
    message: 'Desativar mensagem de boas vindas.'
  },
  {
    key: 'cancelar',
    aliases: ['cancelar','cancel'],
    message: 'Cancelar comando.'
  }
]

class WelcomeCommand extends Command {
  constructor() {
    super('welcome', {
      aliases: ['welcome'],
      category: Configuration,
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [
        {
          id: 'option',
          type: word => {
            const option = options.find((o, i) => Number(word) === (i+1) || o.aliases.includes(word.toLowerCase()))
            if (option) return option.key

          },
          prompt: {
            start: `o você gostaria de fazer?\n${options.map((x, i) => `${i+1} - ${x.message}`).join('\n')}`,
            retry: 'digite uma das opções corretamente.'
          }
        },
        {
          id: 'message',
          type: (word, _, args: ArgsI) => {
            if (args.option === 'alterar')
              if (word) return word
              else return null
            else return ''
          },
          match: 'text',
          prompt: {
            start: () => 'Digite uma nova mensagem de boas vindas.\n- **Nome do usuário**: `{{user}}`\n- **Nome do servidor**: \`{{guild}}\`'
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
      case 'cancelar': {
        return msg.reply('comando cancelado.')
      }
      case 'ativar': {
        const welcome = guildData.data.welcome.find(x => x.channelId === msg.channel.id)
        if (welcome && welcome.active) {
          return msg.reply('mensagem de boas vindas já está ativado.')
        }
        await guildData.updateWelcome({
          channelId: msg.channel.id,
          active: true
        })
        return msg.reply('mensagem de boas vindas ativada.')
      }
     case 'desativar': {
      const welcome = guildData.data.welcome.find(x => x.channelId === msg.channel.id)
        if (!welcome ||!welcome.active) {
          return msg.reply('mensagem de boas vindas já está desativados.')
        }
        await guildData.updateWelcome({
          channelId: msg.channel.id,
          active: false
        })
        return msg.reply('mensagem de boas vindas desativado.')
      }
    case 'alterar': {
      const welcome = guildData.data.welcome.find(x => x.channelId === msg.channel.id)
      if (welcome && welcome.message && welcome.message === args.message) {
        return msg.reply('essa já é a atual mensagem de boas vindas.')
      }
      await guildData.updateWelcome({
        channelId: msg.channel.id,
        message: args.message
      })
      return msg.reply('mensagem de boas vindas alterada.')
    }
    }
  }
}

export default WelcomeCommand;
