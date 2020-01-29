"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Constants = require('@utils/Constants');





class AnunciarCommand extends _Command2.default {
  constructor() {
    super('anunciar', {
      aliases: ['anunciar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:anunciar.args.text.start'),
            retry: _Command.Prompt.call(void 0, 'commands:anunciar.args.text.retry'),
          },
        },
      ],
    });
  }

  async run(msg, t, args) {
    const title = t('commands:anunciar.embed_title', { emoji: _Constants.Emojis.ANUNCIAR });
    return msg.channel.send(new (0, _Embed2.default)(msg.author).setAuthor(title).setDescription(args.text));
  }
}

exports. default = AnunciarCommand;
