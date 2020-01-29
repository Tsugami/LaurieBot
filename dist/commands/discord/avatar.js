"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);

var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);





class AvatarCommand extends _Command2.default {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: 'discord',
      args: [
        {
          id: 'user',
          type: 'user',
          default: (msg) => msg.author,
        },
      ],
    });
  }

  run(msg, t, args) {
    const { user } = args;

    const embed = new (0, _Embed2.default)(msg.author)
      .setAuthor(`📸 ${user.username}`)
      .setDescription(t('commands:avatar.embed_description', { avatarUrl: user.displayAvatarURL }))
      .setImage(user.displayAvatarURL);
    msg.reply(embed);
  }
}

exports. default = AvatarCommand;
