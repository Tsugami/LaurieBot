"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _categories = require('@categories');
var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _Constants = require('@utils/Constants');
var _Date = require('@utils/Date');

class UserinfoCommand extends _Command2.default {
  constructor() {
    super('userinfo', {
      aliases: ['userinfo'],
      category: _categories.Discord,
      channelRestriction: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          default: (msg) => msg.member,
        },
      ],
    });
  }

  run(msg, t, { member }) {
    const { author, guild } = msg;
    const { user, presence } = member;
    const text = new (0, _Text2.default)();

    const status = t(`commons:status:${presence.status}`);
    const statusEmoji = _Constants.STATUS_EMOJIS[presence.status];

    const gameName = presence.game ? presence.game.name : t('commons:nothing');
    const playing = presence.game ? presence.game.type : 0;
    const playingName = t(`commons:playing.${playing}`);
    const playingEmoji = _Constants.PLAYING_EMOJIS[playing];

    const roles = member.roles
      .filter(role => role.id !== guild.id)
      .map(role => role.toString())
      .slice(0, 5);

    const roleMessage = roles.length > 0 ? roles.join(', ') : t('commons:none');

    text.addTitle(_Constants.Emojis.WALLET, t('commands:userinfo.user_info', { username: user.username.toLowerCase() }));
    text.addField(_Constants.Emojis.PERSON, t('commons:name'), user.tag);
    text.addField(_Constants.Emojis.COMPUTER, t('commons:id'), user.id);
    text.addField(statusEmoji, t('commons:status_e'), status);
    text.addField(_Constants.Emojis.CALENDER, t('commons:created_on'), _Date.getDate.call(void 0, user.createdAt));
    text.addField(_Constants.Emojis.INBOX, t('commons:joined_on'), _Date.getDate.call(void 0, member.joinedAt));
    text.addField(playingEmoji, playingName, gameName);
    text.addField(_Constants.Emojis.BRIEFCASE, t('commons:roles'), roleMessage);

    const embed = new (0, _Embed2.default)(author)
      .setAuthor(user.username, user.displayAvatarURL)
      .setDescription(text)
      .setThumbnail(user.displayAvatarURL);
    msg.reply(embed);
  }
}

exports. default = UserinfoCommand;
