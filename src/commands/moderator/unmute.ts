import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { Moderator } from '@categories';
import { MUTE_ROLE_NAME } from '@utils/Constants';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'desmutar'],
      category: Moderator,
      channelRestriction: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      clientPermissions: 'MUTE_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: 'qual usuário(a) você gostaria de desmutar?',
            retry: 'Isso não é um usuário valido!',
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: 'Motivo não declarado.',
        },
      ],
    });
  }

  async exec(msg: Message, args: ArgsI) {
    const author = msg.member;
    const { member } = args;
    const ownerId = msg.guild.ownerID;
    const bot = msg.guild.me;

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply('você não tem cargo suficiente pra desmutar esse membro.');
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply('eu não tenho cargo suficiente pra desmutar esse membro.');
    }

    const role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME);
    if (!role || !member.roles.has(role.id)) {
      return msg.reply('esse usuário não está mutado.');
    }

    try {
      await member.removeRole(role, args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply('usuário(a) desmutado(a) com sucesso!');
    } catch (error) {
      console.error(error);
      return msg.reply('não foi possivel desmutar esse usuário.');
    }
  }
}

export default UnmuteCommand;
