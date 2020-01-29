"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);








class BanCommand extends _Command2.default {
  constructor() {
    super('ban', {
      aliases: ['ban', 'banir'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'BAN_MEMBERS',
      clientPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:ban.args.member.start'),
            retry: _Command.Prompt.call(void 0, 'commands:ban.args.member.retry'),
          },
        },
        {
          id: 'reason',
          match: 'text',
          type: 'string',
          default: _Command.Prompt.call(void 0, 'commands:ban.args.default'),
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
      return msg.reply(t('commands:ban.user_is_owner'));
    }

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:ban.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:ban.not.bot_has_role_highest'));
    }

    try {
      await member.kick(args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:ban.user_banned'));
    } catch (error) {
      console.error('Falha ao expulsar membro', error);
      return msg.reply(t('commands:ban.user_ban_failed'));
    }
  }
}

exports. default = BanCommand;
