import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, GuildMember } from 'discord.js';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'expulsar'],
      category: 'moderator',
      help: 'expulsar',
      channelRestriction: 'guild',
      userPermissions: 'KICK_MEMBERS',
      clientPermissions: 'KICK_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: Prompt('commands:kick.args.member.start'),
            retry: Prompt('commands:kick.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          match: 'text',
          default: Prompt('commands:kick.args.default'),
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const author = msg.member;
    const { member } = args;
    const ownerId = msg.guild.ownerID;
    const bot = msg.guild.me;

    if (ownerId === member.user.id) {
      return msg.reply(t('commands:kick.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:kick.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:kick.not.bot_has_role_highest'));
    }

    try {
      await member.kick(args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:kick.user_kicked'));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:kick.failed'));
    }
  }
}

export default KickCommand;
