"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);







class KickCommand extends _Command2.default {
  constructor() {
    super('kick', {
      aliases: ['kick', 'expulsar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'KICK_MEMBERS',
      clientPermissions: 'KICK_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:kick.args.member.start'),
            retry: _Command.Prompt.call(void 0, 'commands:kick.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          match: 'text',
          default: _Command.Prompt.call(void 0, 'commands:kick.args.default'),
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

    try {
      await member.kick(args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:kick.user_kicked'));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:kick.failed'));
    }
  }
}

exports. default = KickCommand;
