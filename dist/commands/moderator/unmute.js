"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Constants = require('@utils/Constants');






class UnmuteCommand extends _Command2.default {
  constructor() {
    super('unmute', {
      aliases: ['unmute', 'desmutar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MUTE_MEMBERS',
      clientPermissions: 'MUTE_MEMBERS',
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:unmute.args.member.start'),
            retry: _Command.Prompt.call(void 0, 'commands:unmute.args.member.retry'),
          },
        },
        {
          id: 'reason',
          type: 'string',
          default: _Command.Prompt.call(void 0, 'commands:unmute.args.default'),
        },
      ],
    });
  }

  async run(msg, t, args) {
    const author = msg.member;
    const { member } = args;
    const ownerId = msg.guild.ownerID;
    const bot = msg.guild.me;

    if (ownerId !== author.user.id && member.highestRole.position >= author.highestRole.position) {
      return msg.reply(t('commands:kick.not.author_has_role_highest'));
    }

    if (member.highestRole.position >= bot.highestRole.position) {
      return msg.reply(t('commands:kick.not.bot_has_role_highest'));
    }

    const role = msg.guild.roles.find(r => r.name === _Constants.MUTE_ROLE_NAME);
    if (!role || !member.roles.has(role.id)) {
      return msg.reply(t('commands:kick.not.user_muted'));
    }

    try {
      await member.removeRole(role, args.reason);
      this.client.emit('punishmentCommand', msg, this, member, args.reason);
      return msg.reply(t('commands:kick.user_muted'));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:kick.failed'));
    }
  }
}

exports. default = UnmuteCommand;
