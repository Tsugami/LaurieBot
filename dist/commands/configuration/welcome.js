"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }








var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);


const options = _Command.defineOptions.call(void 0, [
  {
    key: 'change_message',
    aliases: ['message'],
    message: 'commands:welcome.args.option.change_message',
    parse: (_, args) => !!args.guildData.data.welcome,
  },
  {
    key: 'change_channel',
    aliases: ['alterar', 'change'],
    message: 'commands:welcome.args.option.change_channel',
    parse: (_, args) => !!args.guildData.data.welcome,
  },
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'commands:welcome.args.option.enable',
    parse: (_, args) => !args.guildData.data.welcome,
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'commands:welcome.args.option.disable',
    parse: (_, args) => !!args.guildData.data.welcome,
  },
]);









class WelcomeCommand extends _Command2.default {
  constructor() {
    super('welcome', {
      aliases: ['welcome'],
      category: 'configuration',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [
        _Command.guildDataArg,
        _Command.optionsArg.call(void 0, 'option', options, _Command.Prompt.call(void 0, 'commons:choose_option')),
        {
          id: 'message',
          type: (word, msg, args) =>
            _Command.getArgumentAkairo(this.client, args.option, [[['change_message', 'enable'], 'string']])(
              word,
              msg,
              args,
            ),
          match: 'text',
          prompt: {
            start: _Command.Prompt((t, _, args) => {
              if (args.option === 'change_message') return t('commands:welcome.args.message.change_message');
              return t('commands:welcome.args.message.enable');
            }),
          },
        },
        {
          id: 'channel',
          type: (word, msg, args) =>
            _Command.getArgumentAkairo(this.client, args.option, [['change_channel', 'textChannel']])(word, msg, args),
          match: 'text',
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:welcome.args.channel.change_channel'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancel',
      },
    });
  }

  async run(msg, t, args) {
    const { guildData, option, message } = args;
    const { welcome } = guildData.data;

    switch (option) {
      default:
        return msg.reply(t('commons:cancel'));
      case 'enable': {
        await guildData.updateWelcome({
          channelId: msg.channel.id,
          message,
        });
        return msg.reply(t('commands:welcome.enabled'));
      }
      case 'disable': {
        await guildData.disableWelcome();
        return msg.reply(t('commads:welcome.disabled'));
      }
      case 'change_message': {
        if (welcome && welcome.message && welcome.message === args.message) {
          return msg.reply(t('commands:welcome.already_current_message'));
        }
        await guildData.updateWelcome({
          channelId: msg.channel.id,
          message: args.message,
        });
        return msg.reply(t('commands:welcome.message_changed'));
      }
      case 'change_channel': {
        if (welcome && welcome.channelId === args.channel.id) {
          return msg.reply(t('commands:welcome.already_current_channel'));
        }
        await guildData.updateWelcome({
          message: welcome ? welcome.message : '',
          channelId: args.channel.id,
        });
        return msg.reply(t('commands:welcome.channel_changed'));
      }
    }
  }
}

exports. default = WelcomeCommand;
