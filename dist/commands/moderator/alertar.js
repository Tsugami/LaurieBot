"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);







class AlertarCommand extends _Command2.default {
  constructor() {
    super('alertar', {
      aliases: ['alertar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:alertar.args.text.start'),
            retry: _Command.Prompt.call(void 0, 'commands:alertar.args.text.retry'),
          },
        },
      ],
    });
  }

  async run(msg, t, args) {
    const dms = await Promise.all(
      msg.guild.members.filter(m => !m.user.bot).map(member => member.createDM().catch(() => null)),
    );
    dms.forEach(dm => {
      if (dm) {
        dm.send(args.text).catch(() => null);
      }
    });

    msg.reply(t('commands:alertar.message'));
  }
}

exports. default = AlertarCommand;
