"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Math = require('@utils/Math');
var _Constants = require('@utils/Constants');

class CornoCommand extends _Command2.default {
  constructor() {
    super('corno', {
      aliases: ['corno'],
      category: 'interactivity',
    });
  }

  run(msg, t) {
    const num = _Math.getRandomInt.call(void 0, 1, 100);
    msg.reply(t('commands:corno.message', { num, emoji: _Constants.Emojis.OX }));
  }
}

exports. default = CornoCommand;
