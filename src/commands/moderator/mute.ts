import LaurieCommand from '@structures/LaurieCommand';
import { GuildMember, Role, TextChannel, VoiceChannel, Message, Guild } from 'discord.js';
import { EMBED_DEFAULT_COLOR, MUTE_ROLE_NAME, EMOJIS } from '@utils/constants';
import LaurieEmbed from '@structures/LaurieEmbed';

export default class Mute extends LaurieCommand {
  constructor() {
    super('mute', {
      aliases: ['desmutar'],
      editable: true,
      category: 'moderator',
      lock: 'guild',
      userPermissions: ['MUTE_MEMBERS', 'MANAGE_ROLES'],
      clientPermissions: ['MUTE_MEMBERS', 'MANAGE_ROLES'],
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: (m: Message) => m.t('commands:mute.args.member.start'),
            retry: (m: Message) => m.t('commands:mute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: (m: Message) => m.t('commands:mute.args.reason.default'),
        },
      ],
    });
  }

  async exec(msg: Message, { reason, member }: { member: GuildMember; reason: string }) {
    const author = msg.member as GuildMember;
    const guild = msg.guild as Guild;
    const ownerId = guild.ownerID;
    const bot = guild.me as GuildMember;

    if (ownerId === member.user.id) {
      return msg.reply(msg.t('commands:mute.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.roles.highest.position >= author.roles.highest.position) {
      return msg.reply(msg.t('commands:mute.not.author_has_role_highest'));
    }

    if (member.roles.highest.position >= bot.roles.highest.position) {
      return msg.reply(msg.t('commands:mute.not.bot_has_role_highest'));
    }

    let role = guild.roles.cache.find(r => r.name === MUTE_ROLE_NAME);
    if (role && member.roles.cache.has(role.id)) {
      return msg.reply(msg.t('commands:mute.already_is_muted'));
    }

    const createMuteRole = async () => {
      const loadingMsg = (await msg.reply(
        new LaurieEmbed(null, msg.t('commands:mute.loading_msg', { emoji: EMOJIS.LOADING_EMOJI })),
      )) as Message;

      let newRole: Role;
      try {
        newRole = await guild.roles.create({
          data: {
            name: MUTE_ROLE_NAME,
            position: bot.roles.highest.position - 2,
            color: EMBED_DEFAULT_COLOR,
            permissions: 0,
          },
        });
      } catch (error) {
        this.logger.error(error);
        loadingMsg.delete();
        return msg.reply(msg.t('commands:mute.create_mute_role_failed'));
      }

      const channelsFailed: Array<TextChannel | VoiceChannel> = [];
      guild.channels.cache.forEach(async channel => {
        if (channel instanceof TextChannel) {
          await channel
            .overwritePermissions([
              {
                id: newRole.id,
                deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
              },
            ])
            .catch(() => channelsFailed.push(channel));
        } else if (channel instanceof VoiceChannel) {
          await channel
            .overwritePermissions([
              {
                id: newRole.id,
                deny: ['SPEAK', 'CONNECT'],
              },
            ])
            .catch(() => channelsFailed.push(channel));
        }
      });

      await loadingMsg.delete();
      if (channelsFailed.length) {
        const channels = channelsFailed.map(c => c.toString || c.name || c.id).join(', ');
        msg.reply(msg.t('commands:mute.warn', { channels }));
      }

      return newRole;
    };

    if (!role) role = (await createMuteRole()) as Role;
    if (role instanceof Role) {
      try {
        await member.roles.add(role, reason);
        // sendPunaltyMessage(msg, member, 'mute', reason);
        return msg.reply(msg.t('commands:mute.user_muted'));
      } catch (error) {
        this.logger.error(error);
        return msg.reply(msg.t('commands:mute.failed'));
      }
    }
  }
}
