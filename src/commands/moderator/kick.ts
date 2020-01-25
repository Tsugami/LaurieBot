import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { Moderator } from '../../categories';

interface ArgsI {
  member: GuildMember
  reason: string
}

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'expulsar'],
      category: Moderator,
      channelRestriction: 'guild',
      userPermissions: 'KICK_MEMBERS',
      clientPermissions: 'KICK_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'qual usuário(a) você gostaria de expulsar?',
            retry: 'Isso não é um usuário valido!'
          }
        },
        {
          id: 'reason',
          type: 'string',
          default: 'Motivo não declarado.'
        }
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    const author = msg.member
    const member = args.member
    const ownerId = msg.guild.ownerID
    const bot = msg.guild.me

    if (ownerId === member.user.id) {
      return msg.reply('você não pode expulsar o dono do servidor.')
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply('você não tem cargo suficiente pra expulsar esse membro.')
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply('eu não tenho cargo suficiente pra expulsar esse membro.')
    }


    try {
      await member.kick(args.reason)
      this.client.emit('punishmentCommand', msg, this, member, args.reason)
      return msg.reply('usuário(a) expulso(a) com sucesso!')
    } catch (error) {
      console.error(error)
      return msg.reply('não foi possivel expulsar esse usuário.')
    }
  }
}

export default KickCommand;
