"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);

var _discordjs = require('discord.js');
var _minecraft = require('@services/minecraft');





class McConquistaCommand extends _Command2.default {
  constructor() {
    super('mcconquista', {
      aliases: ['mcconquista'],
      category: 'minecraft',
      args: [
        {
          id: 'text',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, t, args) {
    const image = _minecraft.getAwardImage.call(void 0, t('commands:mcconquista.message'), args.text);
    msg.reply(new (0, _discordjs.Attachment)(image, 'image.png'));
  }
}

exports. default = McConquistaCommand;
