import LaurieCommand from '@structures/LaurieCommand';
import { Message, GuildMember } from 'discord.js';
import PunishmentUtil from '@utils/modules/punishment';

export default class Ban extends LaurieCommand {
  constructor() {
    super('ban', {
      aliases: ['banir'],
      editable: true,
      category: 'moderator',
      lock: 'guild',
      userPermissions: 'BAN_MEMBERS',
      clientPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (m: Message) => m.t('commands:ban.args.member.start'),
            retry: (m: Message) => m.t('commands:ban.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: (m: Message) => m.t('commands:ban.args.reason.default'),
        },
      ],
    });
  }

  async exec(msg: Message, { reason, member }: { member: GuildMember; reason: string }) {
    const author = msg.member as GuildMember;
    const ownerId = msg.guild?.ownerID;
    const bot = msg.guild?.me as GuildMember;

    if (ownerId === member.user.id) {
      return msg.reply(msg.t('commands:ban.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.roles.highest.position >= author.roles.highest.position) {
      return msg.reply(msg.t('commands:ban.not.author_has_role_highest'));
    }

    if (member.roles.highest.position >= bot.roles.highest.position) {
      return msg.reply(msg.t('commands:ban.not.bot_has_role_highest'));
    }

    try {
      await member.ban({ reason });
      PunishmentUtil.sendMessage(msg, member, this.id, reason);
      return msg.reply(msg.t('commands:ban.user_banned'));
    } catch (error) {
      this.logger.error(error);
      return msg.reply(msg.t('commands:ban.user_ban_failed'));
    }
  }
}
