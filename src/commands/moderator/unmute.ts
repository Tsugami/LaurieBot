import LaurieCommand from '@structures/LaurieCommand';
import { GuildMember, Message, Guild } from 'discord.js';
import { MUTE_ROLE_NAME } from '@utils/constants';
import PunishmentUtil from '@utils/modules/punishment';

export default class Unmute extends LaurieCommand {
  constructor() {
    super('unmute', {
      aliases: ['desmutar'],
      editable: true,
      category: 'moderator',
      channel: 'guild',
      userPermissions: ['MUTE_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
      clientPermissions: ['MUTE_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'],
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (m: Message) => m.t('commands:unmute.args.member.start'),
            retry: (m: Message) => m.t('commands:unmute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: (m: Message) => m.t('commands:unmute.args.reason.default'),
        },
      ],
    });
  }

  async exec(msg: Message, { reason, member }: { member: GuildMember; reason: string }) {
    const author = msg.member as GuildMember;
    const guild = msg.guild as Guild;
    const ownerId = guild.ownerID;
    const bot = guild.me as GuildMember;

    if (ownerId !== author.user.id && member.roles.highest.position >= author.roles.highest.position) {
      return msg.reply(msg.t('commands:unmute.not.author_has_role_highest'));
    }

    if (member.roles.highest.position >= bot.roles.highest.position) {
      return msg.reply(msg.t('commands:unmute.not.bot_has_role_highest'));
    }

    const role = guild.roles.cache.find(r => r.name === MUTE_ROLE_NAME);
    if (!role || !member.roles.cache.has(role.id)) {
      return msg.reply(msg.t('commands:unmute.not.user_muted'));
    }

    try {
      await member.roles.remove(role, reason);
      PunishmentUtil.sendMessage(msg, member, this.id, reason);

      return msg.reply(msg.t('commands:unmute.user_muted'));
    } catch (error) {
      this.logger.error(error);
      return msg.reply(msg.t('commands:unmute.failed'));
    }
  }
}
