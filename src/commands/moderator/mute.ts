import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, GuildMember, Role, TextChannel, VoiceChannel } from 'discord.js';
import { EMBED_DEFAULT_COLOR, MUTE_ROLE_NAME } from '@utils/Constants';

interface ArgsI {
  member: GuildMember;
  reason: string;
}

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute', 'mutar'],
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

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const author = msg.member;
    const { member } = args;
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

    let role: Role = msg.guild.roles.find(r => r.name === MUTE_ROLE_NAME);

    try {
      role = await msg.guild.createRole({
        name: MUTE_ROLE_NAME,
        position: bot.highestRole.position - 1,
        color: EMBED_DEFAULT_COLOR,
        permissions: 0,
      });
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:kick.not.create_mute_role_failed'));
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

    try {
      await member.addRole(role);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:mute.user_muted'));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:mute.failed'));
    }
  }
}

export default MuteCommand;
