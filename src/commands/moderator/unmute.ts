import Command, { TFunction, Prompt } from '@struct/Command';

import { Message, GuildMember } from 'discord.js';
import { MUTE_ROLE_NAME } from '@utils/Constants';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'desmutar'],
      category: 'moderator',
      channelRestriction: 'guild',
      help: 'desmutar',
      userPermissions: 'MUTE_MEMBERS',
      clientPermissions: 'MUTE_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: Prompt('commands:unmute.args.member.start'),
            retry: Prompt('commands:unmute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: Prompt('commands:unmute.args.default'),
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const author = msg.member;
    const { member } = args;
    const ownerId = msg.guild.ownerID;
    const bot = msg.guild.me;

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:unmute.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:unmute.not.bot_has_role_highest'));
    }

    const role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME);
    if (!role || !member.roles.has(role.id)) {
      return msg.reply(t('commands:unmute.not.user_muted'));
    }

    try {
      await member.removeRole(role, args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:unmute.user_muted'));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:unmute.failed'));
    }
  }
}

export default UnmuteCommand;
