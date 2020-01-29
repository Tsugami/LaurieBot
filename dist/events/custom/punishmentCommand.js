"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordakairo = require('discord-akairo');
var _discordjs = require('discord.js');
var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _Constants = require('@utils/Constants');
var _Date = require('@utils/Date');
var _index = require('@database/index');
var _Command = require('@struct/Command');

 class PunishmentCommandListener extends _discordakairo.Listener {
  constructor() {
    super('punishmentCommand', {
      emitter: 'client',
      eventName: 'punishmentCommand',
    });
  }

  async exec(msg, command, member, reason) {
    const guildData = await _index.guild.call(void 0, msg.guild.id);
    if (guildData) {
      const channels = guildData.data.penaltyChannels;
      const t = _Command.getFixedT.call(void 0, msg);

      channels.forEach(channelId => {
        const channel = msg.guild.channels.get(channelId);

        if (channel instanceof _discordjs.TextChannel) {
          const text = new (0, _Text2.default)()
            .addTitle(_Constants.Emojis.BALLOT_BOX, t('modules:punishment.punishment_info'))
            .addField(_Constants.Emojis.PAGE, t('modules:punishment.type'), command.id)
            .addField(_Constants.Emojis.MAN_JUDGE, t('modules:punishment.judge'), msg.author.toString())
            .addField(_Constants.Emojis.SCALES, t('modules:punishment.reason'), reason)
            .addField(_Constants.Emojis.CAP, t('modules:punishment.user'), member.toString())
            .addField(_Constants.Emojis.SPEECH_BALLON, t('modules:punishment.text_channel'), msg.channel.toString())
            .skip()
            .addTitle(_Constants.Emojis.CARD_INDEX, t('modules:punishment.user_info'))
            .addField(_Constants.Emojis.PERSON, t('commons:name'), member.user.tag)
            .addField(_Constants.Emojis.COMPUTER, t('commons:id'), member.user.id)
            .addField(_Constants.Emojis.CALENDER, t('commons:joined_on'), _Date.getDate.call(void 0, member.joinedAt));

          const embed = new (0, _Embed2.default)(msg.author).setDescription(text).setThumbnail(member.user.displayAvatarURL);

          channel.send(embed);
        }
      });
    }
  }
} exports.default = PunishmentCommandListener;
