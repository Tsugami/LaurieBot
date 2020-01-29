"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);



var _Math = require('@utils/Math');
var _Constants = require('@utils/Constants');

class PenisCommand extends _Command2.default {
  constructor() {
    super('penis', {
      aliases: ['penis', 'pau'],
      category: 'interactivity',
    });
  }

  run(msg, t) {
    const num = _Math.getRandomInt.call(void 0, 1, 30);
    let emoji;

    if (num < 10) {
      emoji = _Constants.Emojis.PINCHING_HAND;
    } else if (num > 23) {
      emoji = _Constants.Emojis.LUL;
    } else {
      emoji = _Constants.Emojis.JOIA;
    }

    msg.reply(t('commands:penis.message', { emoji, num }));
  }
}

exports. default = PenisCommand;
