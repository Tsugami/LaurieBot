import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, GuildMember } from 'discord.js';
import { sendPunaltyMessage } from '@utils/ModuleUtils';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['expulsar'],
      category: 'moderator',
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

  async run(msg: Message, t: TFunction, { member, reason }: ArgsI) {
    const author = msg.member;
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
      await member.kick(reason);
      sendPunaltyMessage(msg, member, this, reason);
      return msg.reply(t('commands:kick.user_kicked'));
    } catch (error) {
      this.printError(error, msg);
      return msg.reply(t('commands:kick.failed'));
    }
  }
}

export default KickCommand;
