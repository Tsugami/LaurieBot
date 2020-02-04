/* eslint-disable @typescript-eslint/camelcase */
import Command, {
  TFunction,
  Prompt,
  defineOptions,
  optionsArg,
  guildDataArg,
  getArgumentAkairo,
  PromptOptions,
} from '@struct/Command';
import { Message, Role } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import ControllerError from '@database/controllers/ControllerError';

interface DefaultArgsI {
  guildData: GuildController;
}

interface EnableArgsI {
  option: 'enable';
  role: Role | 'off';
}

interface DisableArgsI {
  option: 'disable';
}

interface RoleArgsI {
  option: 'set_role' | 'change_role';
  role: Role;
}

type ArgsI = DefaultArgsI & (EnableArgsI | DisableArgsI | RoleArgsI);

const options = defineOptions([
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'commands:tkconfig.args.option.enable',
    parse: (_, a: ArgsI) => !a.guildData.data.ticket || !a.guildData.data.ticket.active,
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'commands:tkconfig.args.option.disable',
    parse: (_, a: ArgsI) => !!a.guildData.data.ticket && a.guildData.data.ticket.active,
  },
  {
    key: 'set_role',
    aliases: ['setar cargo'],
    message: 'commands:tkconfig.args.option.set_role',
    parse: (msg, a: ArgsI) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && (!ticket.role || !msg.guild.roles.has(ticket.role)));
    },
  },
  {
    key: 'change_role',
    aliases: ['alterar cargo'],
    message: 'commands:tkconfig.args.option.change_role',
    parse: (msg, a: ArgsI) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && ticket.role && msg.guild.roles.has(ticket.role));
    },
  },
]);

type Options = ArgsI['option'];

class SetChannelTkCommand extends Command {
  constructor() {
    super('tkconfig', {
      aliases: ['tkconfig', 'configurartk'],
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      help: 'configurartk',
      category: 'configuration',
      channelRestriction: 'guild',
      args: [
        guildDataArg,
        optionsArg('option', options, 'commands:tkconfig.title'),
        {
          id: 'role',
          type: (word, msg, args: ArgsI) => {
            if (args.option === 'enable' && word.toLowerCase() === 'off') return 'off';
            return getArgumentAkairo<Options>(this.client, args.option, [
              [['enable', 'change_role', 'set_role'], 'role'],
            ])(word, msg, args);
          },
          prompt: {
            start: PromptOptions({
              enable: 'commands:tkconfig.args.role.start.enable',
              change_role: 'commands:tkconfig.args.role.start.change_role',
              set_role: 'commands:tkconfig.args.role.start.set_role',
            }),
            retry: Prompt('commands:tkconfig.args.role.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const { guildData } = args;
    if (args.option === 'enable') {
      if (args.role instanceof Role) guildData.ticket.enable(args.role);
      return msg.reply(t('commands:tkconfig.enable'));
    }

    if (args.option === 'disable') {
      await guildData.ticket.disable();
      return msg.reply(t('commands:tkconfig.disable'));
    }

    if (args.option === 'change_role' || args.option === 'set_role') {
      try {
        await guildData.ticket.changeRole(args.role);
      } catch (error) {
        if (error instanceof ControllerError) {
          return msg.reply(t(error.t));
        }
      }
      return msg.reply(t('commands:tkconfig.role'));
    }
  }
}

export default SetChannelTkCommand;
