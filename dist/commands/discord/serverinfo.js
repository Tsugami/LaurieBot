"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _getCountryInPortuguese = require('@utils/getCountryInPortuguese'); var _getCountryInPortuguese2 = _interopRequireDefault(_getCountryInPortuguese);
var _Constants = require('@utils/Constants');
var _Date = require('@utils/Date');

class ServerinfoCommand extends _Command2.default {
  constructor() {
    super('serverinfo', {
      aliases: ['serverinfo'],
      category: 'discord',
      channelRestriction: 'guild',
    });
  }

  run(msg, t) {
    const { guild, author } = msg;

    const text = new (0, _Text2.default)();

    function getMemberSizeByStatus(status) {
      return guild.members.filter(m => m.user.presence.status === status).size;
    }

    text.addTitle(_Constants.Emojis.FOLDER, t('commands:serverinfo.server_info'));
    text.addField(_Constants.Emojis.COMPUTER, t('commons:id'), guild.id);
    text.addField(_Constants.Emojis.CROWN, t('commands:serverinfo.owner'), guild.owner.user.username);
    text.addField(_Constants.Emojis.EARTH, t('commands:serverinfo.region'), _getCountryInPortuguese2.default.call(void 0, guild.region));
    text.addField(_Constants.Emojis.CALENDER, t('commons:created_on'), _Date.getDate.call(void 0, guild.createdAt));
    text.addField(_Constants.Emojis.INBOX, t('commons:joined_on'), _Date.getDate.call(void 0, guild.joinedAt));
    text.skip();
    text.addTitle(_Constants.Emojis.PERSON, t('commands:serverinfo.members_info'));
    text.addField(_Constants.Emojis.PERSONS, t('commands:serverinfo.members'), guild.members.size);
    text.addField(_Constants.Emojis.ROBOT, t('commands:serverinfo.bots'), guild.members.filter(m => m.user.bot).size);
    text.addField(_Constants.Emojis.STATUS_ONLINE, t('commons:status.online'), getMemberSizeByStatus('online'));
    text.addField(_Constants.Emojis.STATUS_OFFLINE, t('commons:status.offline'), getMemberSizeByStatus('offline'));
    text.addField(_Constants.Emojis.STATUS_BUSY, t('commons:status.dnd'), getMemberSizeByStatus('dnd'));
    text.addField(_Constants.Emojis.STATUS_AWAY, t('commons:status.idle'), getMemberSizeByStatus('idle'));

    const embed = new (0, _Embed2.default)(author).setAuthor(guild.name, guild.iconURL).setDescription(text);
    if (guild.iconURL) embed.setThumbnail(`${guild.iconURL}?size=2048`);
    msg.reply(embed);
  }
}

exports. default = ServerinfoCommand;
