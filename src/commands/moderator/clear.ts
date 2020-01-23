import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Moderator } from '../../categories';
import Embed from '../../utils/Embed';


interface ArgsI {
  amount: number
}

class BanCommand extends Command {
  constructor() {
    super('clear', {
      aliases: ['clear', 'prune', 'limpar'],
      category: Moderator,
      args: [
        {
          id: 'amount',
          type: 'number',
          prompt: {
            start: 'quantas mensagens você gostaria de deletar?',
            retry: 'isso não é um número valido!'
          }
        }
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {

    if (!msg.member.permissions.has('MANAGE_MESSAGES')) {
      return msg.reply('você não possui permissões para gerenciar mensagens um usuário(a).')
    }

    if (!msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
      return msg.reply('eu não possuo permissões para gerenciar mensagens um usuário(a).')
    }
    


    const amount = args.amount
    const result = amount > 100 ? 100 : amount < 1 ? 1 : amount

    try {
      await msg.delete()
      await msg.channel.bulkDelete(result)
      return msg.reply(`${result} mensagens foram deletadas.`)
    } catch (error) {
      console.error(error)
      return msg.reply('não foi possivel deletar as mensagens.')
    }
  }
}

export default BanCommand;
