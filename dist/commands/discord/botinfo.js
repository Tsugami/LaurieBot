"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _Date = require('@utils/Date');
var _Constants = require('@utils/Constants');

async function getUser(userId, client) {
  const findByUsers = client.users.get(userId);
  if (findByUsers) return findByUsers.tag;
  const findByGlobal = await client.fetchUser(userId).catch(() => null);
  if (findByGlobal) return findByGlobal.tag;
  return userId;
}

class BotinfoCommand extends _Command2.default {
  constructor() {
    super('botinfo', {
      aliases: ['botinfo', 'infobot'],
      category: 'discord',
    });
  }

  async run(msg, t) {
    const unknownTranst = t('commons:unknown');
    const bot = msg.client;
    const dev = process.env.DEV_ID ? await getUser(process.env.DEV_ID, bot) : unknownTranst;
    const owner = process.env.CREATOR_ID ? await getUser(process.env.CREATOR_ID, bot) : unknownTranst;
    const text = new (0, _Text2.default)()
      .addTitle(_Constants.Emojis.ROBOT, t('commands:botinfo.bot_info'))
      .addField(_Constants.Emojis.LABEL, t('commons:name'), bot.user.username)
      .addField(_Constants.Emojis.SHIELD, t('commands:botinfo.guilds'), bot.guilds.size)
      .addField(_Constants.Emojis.CALENDER, t('commons:created_on'), _Date.getDate.call(void 0, bot.user.createdAt))
      .addField(_Constants.Emojis.CROWN, t('commands:botinfo.creator'), owner)
      .addField(_Constants.Emojis.KEYBOARD, t('commands:botinfo.developer'), dev);
    const embed = new (0, _Embed2.default)(msg.author).setDescription(text).setThumbnail(bot.user.displayAvatarURL);
    msg.reply(embed);
  }
}

exports. default = BotinfoCommand;
