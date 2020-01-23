import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { Moderator } from '../../categories';
import Embed from '../../utils/Embed';


interface ArgsI {
  member: GuildMember
  reason: string
}

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'banir'],
      category: Moderator,
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'qual usuário(a) você gostaria de banir?',
            retry: 'Isso não é um usuário valido!'
          }
        },
        {
          id: 'reason',
          type: 'string',
          default: 'Motivo declarado.'
        }
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    const author = msg.member
    const member = args.member
    const ownerId = msg.guild.ownerID
    const bot = msg.guild.me

    if (!author.permissions.has('BAN_MEMBERS')) {
      return msg.reply('você não possui permissões para banir um usuário(a).')
    }

    if (!bot.permissions.has('BAN_MEMBERS')) {
      return msg.reply('eu não possuo permissões para banir um usuário(a).')
    }

    if (ownerId === member.user.id) {
      return msg.reply('você não pode banir o dono do servidor.')
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply('você não tem cargo suficiente pra banir esse membro.')
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply('eu não tenho cargo suficiente pra banir esse membro.')
    }

    try {
      await member.kick(args.reason)
      return msg.reply('usuário(a) banido(a) com sucesso!')
    } catch (error) {
      console.error(error)
      return msg.reply('mão foi possivel banir esse usuário.')
    }
  }
}

export default BanCommand;
