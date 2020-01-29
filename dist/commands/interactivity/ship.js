"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordjs = require('discord.js');
var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);

var _Jimp = require('@utils/Jimp');






class ShipCommand extends _Command2.default {
  constructor() {
    super('ship', {
      aliases: ['ship', 'shippar'],
      category: 'interactivity',
      args: [
        {
          type: 'user',
          id: 'user1',
          prompt: {
            start: 'quem você quer shipar?',
          },
        },
        {
          type: 'user',
          id: 'user2',
          prompt: {
            start: 'com quem você quer shipar?',
          },
        },
      ],
    });
  }

  async run(msg, t, args) {
    const { buffer } = await _Jimp.ship2.call(void 0, args.user1, args.user2);
    const attch = new (0, _discordjs.Attachment)(buffer, 'ship.png');
    return msg.reply(attch);
  }
}

exports. default = ShipCommand;
