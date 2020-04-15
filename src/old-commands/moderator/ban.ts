import Command from '@struct/command/Command';

import { GuildMember } from 'discord.js';
import { sendPunaltyMessage } from '@utils/ModuleUtils';
import { translationPrompt } from '@utils/CommandUtils';
import { printError } from '@utils/Utils';

export default new Command(
  'ban',
  {
    aliases: ['banir'],
    category: 'moderator',
    channelRestriction: 'guild',
    userPermissions: 'BAN_MEMBERS',
    clientPermissions: 'BAN_MEMBERS',
    args: [
      {
        id: 'member',
        type: 'member',
      },
      {
        id: 'reason',
        match: 'text',
        type: 'string',
        default: translationPrompt('commands:ban.args.reason.default'),
      },
    ],
  },
  async function run(msg, t, { member, reason }: { member: GuildMember; reason: string }) {
    const author = msg.member;
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
      await member.ban(reason);
      sendPunaltyMessage(msg, member, 'ban', reason);
      return msg.reply(t('commands:ban.user_banned'));
    } catch (error) {
      printError(error, this);
      return msg.reply(t('commands:ban.user_ban_failed'));
    }
  },
);
