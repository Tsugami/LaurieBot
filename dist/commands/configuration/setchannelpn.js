"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _index = require('@database/index');
var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);






const prompt = {
  onOption: 'ON',
  offOption: 'OFF',
};

class SetChannelPnCommand extends _Command2.default {
  constructor() {
    super('setchannelpn', {
      aliases: ['setchannelpn', 'setcanalpn'],
      userPermissions: 'MANAGE_GUILD',
      channelRestriction: 'guild',
      category: 'configuration',
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:setchannelpn.args.option.start', prompt),
            retry: _Command.Prompt.call(void 0, 'commands:setchannelpn.args.option.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
      },
    });
  }

  async run(msg, t, args) {
    const guildData = await _index.guild.call(void 0, msg.guild.id);

    if (args.option === 'off') {
      if (guildData.data.penaltyChannels.includes(msg.channel.id)) {
        return msg.reply(t('commands:commands.off_option.already_disabled'));
      }
      await guildData.removePenaltyChannel(msg.channel.id);
      return msg.reply(t('commands:commands.off_option.disabled'));
    }
    if (!guildData.data.penaltyChannels.includes(msg.channel.id)) {
      return msg.reply(t('commands:commands.on_option.already_enabled'));
    }
    await guildData.addPenaltyChannel(msg.channel.id);
    return msg.reply(t('commands:commands.on_option.enabled'));
  }
}

exports. default = SetChannelPnCommand;
