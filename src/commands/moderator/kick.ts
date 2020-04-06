import Command from '@struct/command/Command';
import { GuildMember } from 'discord.js';
import { sendPunaltyMessage } from '@utils/ModuleUtils';
import { printError } from '@utils/Utils';
import { Prompt } from '@utils/CommandUtils';

export default new Command(
  'kick',
  {
    aliases: ['expulsar'],
    category: 'moderator',
    channelRestriction: 'guild',
    userPermissions: 'KICK_MEMBERS',
    clientPermissions: 'KICK_MEMBERS',
    args: [
      {
        id: 'member',
        type: 'member',
      },
      {
        id: 'reason',
        type: 'string',
        match: 'text',
        default: Prompt('commands:kick.args.default'),
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
      sendPunaltyMessage(msg, member, 'kick', reason);
      return msg.reply(t('commands:kick.user_kicked'));
    } catch (error) {
      printError(error, this);
      return msg.reply(t('commands:kick.failed'));
    }
  },
);
