"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);






class ClearCommand extends _Command2.default {
  constructor() {
    super('clear', {
      aliases: ['clear', 'prune', 'limpar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'amount',
          type: 'number',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:clear.args.amount.start'),
            retry: _Command.Prompt.call(void 0, 'commands:clear.args.amount.retry'),
          },
        },
      ],
    });
  }

  async run(msg, t, args) {
    let { amount } = args;

    if (amount > 100) amount = 100;
    else if (amount < 1) amount = 1;

    try {
      await msg.delete();
      await msg.channel.bulkDelete(amount);
      return msg.reply(t('commads:clear.messages_deleted', { amount }));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:clear.failed'));
    }
  }
}

exports. default = ClearCommand;
