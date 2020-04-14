import Command from '@struct/command/Command';
import { GuildMember, Role, TextChannel, VoiceChannel, Message } from 'discord.js';
import { EMBED_DEFAULT_COLOR, MUTE_ROLE_NAME, EMOJIS } from '@utils/Constants';
import { sendPunaltyMessage } from '@utils/ModuleUtils';
import { translationPrompt } from '@utils/CommandUtils';
import { printError } from '@utils/Utils';
import LaurieEmbed from '../../struct/LaurieEmbed';

export default new Command(
  'mute',
  {
    aliases: ['mutar'],
    category: 'moderator',
    channelRestriction: 'guild',
    userPermissions: 'MUTE_MEMBERS',
    clientPermissions: 'MANAGE_ROLES',
    args: [
      {
        id: 'member',
        type: 'member',
      },
      {
        id: 'reason',
        type: 'string',
        default: translationPrompt('commands:mute.args.reason.default'),
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
      return msg.reply(t('commands:mute.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:mute.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:mute.not.bot_has_role_highest'));
    }

    let role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME);
    if (role && member.roles.has(role.id)) {
      return msg.reply(t('commands:mute.already_is_muted'));
    }

    const createMuteRole = async () => {
      const loadingMsg = (await msg.reply(
        new LaurieEmbed(null, t('commands:mute.loading_msg', { emoji: EMOJIS.LOADING_EMOJI })),
      )) as Message;

      let newRole: Role;
      try {
        newRole = await msg.guild.createRole({
          name: MUTE_ROLE_NAME,
          position: bot.highestRole.position - 2,
          color: EMBED_DEFAULT_COLOR,
          permissions: 0,
        });
      } catch (error) {
        printError(error, this);
        loadingMsg.delete();
        return msg.reply(t('commands:mute.create_mute_role_failed'));
      }

      const channelsFailed: Array<TextChannel | VoiceChannel> = [];
      msg.guild.channels.forEach(async channel => {
        if (channel instanceof TextChannel) {
          await channel
            .overwritePermissions(newRole, { SEND_MESSAGES: false, ADD_REACTIONS: false })
            .catch(() => channelsFailed.push(channel));
        } else if (channel instanceof VoiceChannel) {
          await channel
            .overwritePermissions(newRole, { SPEAK: false, CONNECT: false })
            .catch(() => channelsFailed.push(channel));
        }
      });

      await loadingMsg.delete();
      if (channelsFailed.length) {
        const channels = channelsFailed.map(c => c.toString || c.name || c.id).join(', ');
        msg.reply(t('commands:mute.warn', { channels }));
      }

      return newRole;
    };

    if (!role) role = (await createMuteRole()) as Role;
    if (role instanceof Role) {
      try {
        await member.addRole(role);
        sendPunaltyMessage(msg, member, 'mute', reason);
        return msg.reply(t('commands:mute.user_muted'));
      } catch (error) {
        printError(error, this);
        return msg.reply(t('commands:mute.failed'));
      }
    }
  },
);
