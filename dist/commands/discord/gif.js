"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _giphy = require('@services/giphy'); var _giphy2 = _interopRequireDefault(_giphy);
var _Constants = require('@utils/Constants');
var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);





class GifCommand extends _Command2.default {
  constructor() {
    super('gif', {
      aliases: ['gif'],
      category: 'discord',
      args: [
        {
          id: 'query',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg, t, args) {
    let res;
    let sent;

    function deleteMsg() {
      if (sent instanceof Array) {
        return sent.forEach(x => x.delete());
      }
      return sent.delete();
    }

    try {
      sent = await msg.reply(t('commands:gif.searching', { emoji: _Constants.Emojis.COMPUTER }));
      res = await _giphy2.default.random(args.query);
    } catch (error) {
      console.error('Falha ao procurar uma gif', error);
      await deleteMsg();
      msg.reply(t('commands:gif.failed_to_fetch'));
    }

    if (res) {
      await msg.reply(res.data.images.original.url);

      await deleteMsg();
    } else {
      await deleteMsg();
      msg.reply(t('commands:gif:not_found'));
    }
  }
}

exports. default = GifCommand;
