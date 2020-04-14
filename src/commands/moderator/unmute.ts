import Command from '@struct/command/Command';

import { GuildMember } from 'discord.js';
import { MUTE_ROLE_NAME } from '@utils/Constants';
import { sendPunaltyMessage } from '@utils/ModuleUtils';
import { printError } from '@utils/Utils';
import { translationPrompt, Prompt } from '@utils/CommandUtils';

export default new Command(
  'unmute',
  {
    aliases: ['desmutar'],
    category: 'moderator',
    channelRestriction: 'guild',
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
        default: translationPrompt('commands:unmute.args.reason.default'),
      },
    ],
  },
  async function run(
    msg,
    t,
    {
      member,
      reason,
    }: {
      member: GuildMember;
      reason: string;
    },
  ) {
    const author = msg.member;
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
      await member.removeRole(role, reason);
      sendPunaltyMessage(msg, member, 'unmute', reason);
      return msg.reply(t('commands:unmute.user_muted'));
    } catch (error) {
      printError(error, this);
      return msg.reply(t('commands:unmute.failed'));
    }
  },
);
