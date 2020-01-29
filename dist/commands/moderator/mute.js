"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);
var _discordjs = require('discord.js');
var _Constants = require('@utils/Constants');






class MuteCommand extends _Command2.default {
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
            start: _Command.Prompt.call(void 0, 'commands:mute.args.member.start'),
            retry: _Command.Prompt.call(void 0, 'commands:mute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: _Command.Prompt.call(void 0, 'commands:mute.args.default'),
        },
      ],
    });
  }

  async run(msg, t, args) {
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

    let role = msg.guild.roles.find(r => r.name === _Constants.MUTE_ROLE_NAME);

    try {
      role = await msg.guild.createRole({
        name: _Constants.MUTE_ROLE_NAME,
        position: bot.highestRole.position - 1,
        color: _Constants.EMBED_DEFAULT_COLOR,
        permissions: 0,
      });
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:kick.not.create_mute_role_failed'));
    }

    const channelsFailed = [];
    msg.guild.channels.forEach(async channel => {
      if (channel instanceof _discordjs.TextChannel) {
        await channel
          .overwritePermissions(role, { SEND_MESSAGES: false, ADD_REACTIONS: false })
          .catch(() => channelsFailed.push(channel));
      } else if (channel instanceof _discordjs.VoiceChannel) {
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

exports. default = MuteCommand;
