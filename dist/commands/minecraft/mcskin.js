"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _minecraft = require('@services/minecraft');





class McSkinCommand extends _Command2.default {
  constructor() {
    super('mcskin', {
      aliases: ['mcskin'],
      category: 'minecraft',
      args: [
        {
          id: 'username',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, t, args) {
    let res;
    try {
      res = await _minecraft.getUser.call(void 0, args.username);
    } catch (_) {
      return msg.reply(t('commands:mcskin.not_found'));
    }

    const embed = new (0, _Embed2.default)(msg.author).setAuthor(res.name).setImage(res.skin);
    msg.reply(embed);
  }
}

exports. default = McSkinCommand;
