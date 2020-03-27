import Command, { TFunction, Prompt } from '@struct/Command';

import { Message, GuildMember } from 'discord.js';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'banir'],
      category: 'moderator',
      help: 'banir',
      channelRestriction: 'guild',
      userPermissions: 'BAN_MEMBERS',
      clientPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: Prompt('commands:ban.args.member.start'),
            retry: Prompt('commands:ban.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: Prompt('commands:ban.args.default'),
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
      return msg.reply(t('commands:ban.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:ban.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:ban.not.bot_has_role_highest'));
    }

    try {
      await member.ban(args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:ban.user_banned'));
    } catch (error) {
      this.printError(error, msg);
      return msg.reply(t('commands:ban.user_ban_failed'));
    }
  }
}

export default BanCommand;
