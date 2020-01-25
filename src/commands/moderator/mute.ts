import { Command } from 'discord-akairo';
import { Message, GuildMember, Role, Permissions, TextChannel, VoiceChannel } from 'discord.js';
import { Moderator } from '../../categories';
import Embed from '../../utils/Embed';
import { EMBED_DEFAULT_COLOR, MUTE_ROLE_NAME } from '../../utils/Constants';


interface ArgsI {
  member: GuildMember
  reason: string
}

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute', 'mutar'],
      category: Moderator,
      channelRestriction: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      clientPermissions: 'MUTE_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'qual usuário(a) você gostaria de mutar?',
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
      return msg.reply('você não pode mutar o dono do servidor.')
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply('você não tem cargo suficiente pra mutar esse membro.')
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply('eu não tenho cargo suficiente pra mutar esse membro.')
    }


    let role: Role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME)

    if (!role) {
      if (!bot.permissions.has('MANAGE_ROLES')) {
        return msg.reply('eu não tenho permissão pra gerenciar cargos.');
      }

      try {
        role = await msg.guild.createRole({
          name: MUTE_ROLE_NAME,
          position: bot.highestRole.position - 1,
          color: EMBED_DEFAULT_COLOR,
          permissions: 0,
        })

      } catch (error) {
        console.error(error)
        return msg.reply('eu não consegui criar o cargo de mutar.')
      }

      const channelsFailed: Array<TextChannel | VoiceChannel> = []
      msg.guild.channels.forEach(async channel => {
        if (channel instanceof TextChannel) {
          await channel.overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false })
            .then(() => console.log('alterou no canal', channel.name))
            .catch(() => channelsFailed.push(channel))
        } else if (channel instanceof VoiceChannel) {
          await channel.overwritePermissions(role, { SPEAK: false, CONNECT: false })
            .then(() => console.log('alterou no canal', channel.name))
            .catch(() => channelsFailed.push(channel))
        }
      })

      if (channelsFailed.length) {
        msg.reply(`[AVISO] não foi possivel alterar o cargo \`${role.name}\` nos seguintes canais: ${channelsFailed.map(c => c.toString || c.name || c.id).join(', ')}`)
      }

    }

    try {
      await member.addRole(role)
      this.client.emit('punishmentCommand', msg, this, member, args.reason)
      return msg.reply('usuário(a) mutado(a) com sucesso!')
    } catch (error) {
      console.error(error)
      return msg.reply('não foi possivel mutar esse usuário.')
    }
  }
}

export default MuteCommand;
