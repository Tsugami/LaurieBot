"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('./Embed'); var _Embed2 = _interopRequireDefault(_Embed);



class NeekoCommand extends _Command2.default {
  

  

  constructor(commandName, aliases, text, urlFunc) {
    super(commandName, {
      aliases: [commandName, ...aliases],
      category: 'interactivity',
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            retry: 'Mencione um usuário valido.',
          },
        },
      ],
    });
    this.text = text;
    this.urlFunc = urlFunc;
  }

  async run(msg, t, { user }) {
    const url = await this.urlFunc();
    const embed = new (0, _Embed2.default)(msg.author).setDescription(t(this.text, { user1: msg.author, user2: user })).setImage(url);
    msg.reply(embed);
  }
}

exports. default = NeekoCommand;
