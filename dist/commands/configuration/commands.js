"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);
var _index = require('@database/index');





const prompt = {
  onOption: 'ON',
  offOption: 'OFF',
};

class CommandsCommand extends _Command2.default {
  constructor() {
    super('commands', {
      aliases: ['commands', 'comandos', 'desativar'],
      userPermissions: 'MANAGE_MESSAGES',
      category: 'configuration',
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: ['on', 'off'],
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:commands.args.option.start', prompt),
            retry: _Command.Prompt.call(void 0, 'commands:commands.args.option.retry'),
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
      if (guildData.data.disableChannels.includes(msg.channel.id)) {
        return msg.reply(t('commands:commands.off_option.already_disabled'));
      }
      await guildData.disableChannel(msg.channel.id);
      return msg.reply(t('commands:commands.off_option.disabled'));
    }

    if (!guildData.data.disableChannels.includes(msg.channel.id)) {
      return msg.reply(t('commands:commands.on_option.already_enabled'));
    }

    await guildData.enableChannel(msg.channel.id);
    return msg.reply(t('commands:commands.on_option.enabled'));
  }
}

exports. default = CommandsCommand;
