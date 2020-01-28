import { Message, TextChannel } from 'discord.js';

import Command, {
  optionsArg,
  Prompt,
  defineOptions,
  guildDataArg,
  TFunction,
  getArgumentAkairo,
} from '@struct/Command';
import GuildController from '@database/controllers/GuildController';

const options = defineOptions([
  {
    key: 'change_message',
    aliases: ['message'],
    message: 'commands:welcome.args.option.change_message',
    parse: (_, args: ArgsI) => !!args.guildData.data.welcome,
  },
  {
    key: 'change_channel',
    aliases: ['alterar', 'change'],
    message: 'commands:welcome.args.option.change_channel',
    parse: (_, args: ArgsI) => !!args.guildData.data.welcome,
  },
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'commands:welcome.args.option.enable',
    parse: (_, args: ArgsI) => !args.guildData.data.welcome,
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'commands:welcome.args.option.disable',
    parse: (_, args: ArgsI) => !!args.guildData.data.welcome,
  },
]);

type Options = 'enable' | 'disable' | 'change_message' | 'change_channel' | 'cancel';
interface ArgsI {
  guildData: GuildController;
  option: Options;
  message: string;
  channel: TextChannel;
}

class WelcomeCommand extends Command {
  constructor() {
    super('welcome', {
      aliases: ['welcome'],
      category: 'configuration',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [
        guildDataArg,
        optionsArg('option', options, Prompt('commons:choose_option')),
        {
          id: 'message',
          type: (word, msg, args: ArgsI) =>
            getArgumentAkairo<Options>(this.client, args.option, [[['change_message', 'enable'], 'string']])(
              word,
              msg,
              args,
            ),
          match: 'text',
          prompt: {
            start: Prompt((t, _, args: ArgsI) => {
              if (args.option === 'change_message') return t('commands:welcome.args.message.change_message');
              return t('commands:welcome.args.message.enable');
            }),
          },
        },
        {
          id: 'channel',
          type: (word, msg, args: ArgsI) =>
            getArgumentAkairo<Options>(this.client, args.option, [['change_channel', 'textChannel']])(word, msg, args),
          match: 'text',
          prompt: {
            start: Prompt('commands:welcome.args.channel.change_channel'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancel',
      },
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
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

export default WelcomeCommand;
