import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, GuildMember, Role, TextChannel, VoiceChannel } from 'discord.js';
import { EMBED_DEFAULT_COLOR, MUTE_ROLE_NAME } from '@utils/Constants';
import { sendPunaltyMessage } from '@utils/ModuleUtils';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mutar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      clientPermissions: 'MANAGE_ROLES',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: Prompt('commands:mute.args.member.start'),
            retry: Prompt('commands:mute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: Prompt('commands:mute.args.default'),
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, { member, reason }: ArgsI) {
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

    const role: Role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME);
    if (role && member.roles.has(role.id)) {
      return msg.reply(t('commands:mute.already_is_muted'));
    }

    const result = await this.createMuteRole(msg, bot, t);
    if (result instanceof Role) {
      try {
        await member.addRole(role);
        sendPunaltyMessage(msg, member, this, reason);
        return msg.reply(t('commands:mute.user_muted'));
      } catch (error) {
        this.printError(error, msg);
        return msg.reply(t('commands:mute.failed'));
      }
    }
  }

  async createMuteRole(msg: Message, bot: GuildMember, t: TFunction) {
    let role: Role;
    try {
      role = await msg.guild.createRole({
        name: MUTE_ROLE_NAME,
        position: bot.highestRole.position - 1,
        color: EMBED_DEFAULT_COLOR,
        permissions: 0,
      });
    } catch (error) {
      this.printError(error, msg);
      return msg.reply(t('commands:mute.not.create_mute_role_failed'));
    }
    const channelsFailed: Array<TextChannel | VoiceChannel> = [];
    msg.guild.channels.forEach(async channel => {
      if (channel instanceof TextChannel) {
        await channel
          .overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false })
          .catch(() => channelsFailed.push(channel));
      } else if (channel instanceof VoiceChannel) {
        await channel
          .overwritePermissions(role, { SPEAK: false, CONNECT: false })
          .catch(() => channelsFailed.push(channel));
      }
    });

    if (channelsFailed.length) {
      const channels = channelsFailed.map(c => c.toString || c.name || c.id).join(', ');
      msg.reply(t('commands:mute.warn', { channels }));
    }

    return role;
  }
}

export default MuteCommand;
