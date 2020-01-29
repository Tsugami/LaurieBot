"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _Constants = require('@utils/Constants');
var _minecraft = require('@services/minecraft');





class McServerCommand extends _Command2.default {
  constructor() {
    super('mcserver', {
      aliases: ['mcserver'],
      category: 'minecraft',
      args: [
        {
          id: 'server',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, t, args) {
    let res;
    try {
      res = await _minecraft.getServer.call(void 0, args.server);
    } catch (error) {
      console.error('Falha ao procurar server de Minecraft', error);
      return msg.reply(t('commands:mcserver.not_found'));
    }

    const text = new (0, _Text2.default)()
      .addTitle(_Constants.Emojis.PLACA_MINECRAFT, t('commands:mcserver.server_info'))
      .addField(_Constants.Emojis.COMPUTER, t('commands:mcserver.address'), res.address)
      .addField(_Constants.Emojis.PERSONS, t('commands:mcserver.players'), res.players)
      .addField(_Constants.Emojis.JAVA, t('commands:mcserver.minecraft_version'), res.version);
    const embed = new (0, _Embed2.default)(msg.author).setDescription(text);
    msg.reply(embed);
  }
}

exports. default = McServerCommand;
