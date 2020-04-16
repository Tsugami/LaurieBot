import LaurieCommand from '@structures/LaurieCommand';
import { Message, GuildMember } from 'discord.js';

export default class Kick extends LaurieCommand {
  constructor() {
    super('kick', {
      aliases: ['expulsar'],
      editable: true,
      category: 'moderator',
      lock: 'guild',
      userPermissions: 'KICK_MEMBERS',
      clientPermissions: 'KICK_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (m: Message) => m.t('commands:kick.args.member.start'),
            retry: (m: Message) => m.t('commands:kick.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: (m: Message) => m.t('commands:kick.args.reason.default'),
        },
      ],
    });
  }

  async exec(msg: Message, { reason, member }: { member: GuildMember; reason: string }) {
    const author = msg.member as GuildMember;
    const ownerId = msg.guild?.ownerID;
    const bot = msg.guild?.me as GuildMember;

    if (ownerId === member.user.id) {
      return msg.reply(msg.t('commands:kick.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.roles.highest.position >= author.roles.highest.position) {
      return msg.reply(msg.t('commands:kick.not.author_has_role_highest'));
    }

    if (member.roles.highest.position >= bot.roles.highest.position) {
      return msg.reply(msg.t('commands:kick.not.bot_has_role_highest'));
    }

    try {
      await member.kick(reason);
      // sendPunaltyMessage(msg, member, 'kick', reason);
      return msg.reply(msg.t('commands:kick.user_kicked'));
    } catch (error) {
      this.logger.error(error);
      return msg.reply(msg.t('commands:kick.failed'));
    }
  }
}
