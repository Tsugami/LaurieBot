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
import { Message, TextChannel, CategoryChannel, Role, Channel } from 'discord.js';
import GuildController from 'database/controllers/GuildController';
import { setupMainChannel } from '@ticket/setupMainChannel';
import deleteAll from '@ticket/deleteAllHandler';

interface DefaultArgsI {
  guildData: GuildController;
}

interface EnableArgsI {
  option: 'enable';
  channel: TextChannel;
  category: CategoryChannel;
  role: Role | 'off';
}

interface DisableArgsI {
  option: 'disable';
}

interface ChannelArgsI {
  option: 'channel';
  channel: TextChannel;
}

interface CategoryArgsI {
  option: 'set_category' | 'change_category';
  category: CategoryChannel;
}

interface RoleArgsI {
  option: 'set_role' | 'change_role';
  role: Role;
}

type ArgsI = DefaultArgsI & (EnableArgsI | DisableArgsI | ChannelArgsI | CategoryArgsI | RoleArgsI);

const options = defineOptions([
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'commands:tkconfig.args.option.enable',
    parse: (msg, a: ArgsI) =>
      !a.guildData.data.ticket ||
      !a.guildData.data.ticket.active ||
      !msg.guild.channels.has(a.guildData.data.ticket.channelId),
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'commands:setchanneltk.args.option.disable',
    parse: (_, a: ArgsI) => !!(a.guildData.data.ticket && a.guildData.data.ticket.active),
  },
  {
    key: 'channel',
    aliases: ['canal', 'alterar channel'],
    message: 'commands:setchanneltk.args.option.channel',
    parse: (_, a: ArgsI) => !!(a.guildData.data.ticket && a.guildData.data.ticket.active),
  },
  {
    key: 'set_category',
    aliases: ['categoria'],
    message: 'commands:tkconfig.args.option.set_category',
    parse: (msg, a: ArgsI) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && (!ticket.categoryId || !msg.guild.roles.has(ticket.categoryId)));
    },
  },
  {
    key: 'change_category',
    aliases: ['categoria'],
    message: 'commands:tkconfig.args.option.set_category',
    parse: (msg, a: ArgsI) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && ticket.categoryId && msg.guild.channels.has(ticket.categoryId));
    },
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
      aliases: ['tkconfig'],
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      category: 'configuration',
      channelRestriction: 'guild',
      args: [
        guildDataArg,
        optionsArg('option', options, Prompt('commons:choose_option')),
        {
          id: 'channel',
          type: (word, msg, args: ArgsI) =>
            getArgumentAkairo<Options>(this.client, args.option, [[['channel', 'enable'], 'textChannel']])(
              word,
              msg,
              args,
            ),
          prompt: {
            start: Prompt('commands:tkconfig.args.channel.start'),
            retry: Prompt('commands:tkconfig.args.channel.retry'),
          },
        },
        {
          id: 'category',
          type: (word, msg, args: ArgsI) => {
            const channel = getArgumentAkairo<Options>(this.client, args.option, [
              [['change_category', 'enable', 'set_category'], 'channel'],
            ])(word, msg, args);
            if (channel instanceof Channel) {
              if (channel instanceof CategoryChannel) return channel;
              return null;
            }
            return channel;
          },
          prompt: {
            start: PromptOptions({
              enable: 'commands:tkconfig.args.category.start.enable',
              change_category: 'commands:tkconfig.args.category.start.change_category',
              set_category: 'commands:tkconfig.args.category.start.set_category',
            }),
            retry: Prompt('commands:tkconfig.args.category.retry'),
          },
        },
        {
          id: 'role',
          type: (word, msg, args: ArgsI) => {
            if (args.option === 'enable' && word === 'off') return 'off';
            return getArgumentAkairo<Options>(this.client, args.option, [
              [['enable', 'change_role', 'set_role'], 'role'],
            ])(word, msg, args);
          },
          prompt: {
            start: PromptOptions({
              enable: 'commands:tkconfig.args.enable.start.enable',
              change_role: 'commands:tkconfig.args.role.start.change_role',
              set_role: 'commands:tkconfig.args.role.start.set_role',
            }),
            retry: Prompt('commands:tkconfig.args.role.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: Prompt('commons:cancel'),
      },
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const { guildData } = args;
    if (args.option === 'enable') {
      await setupMainChannel(
        t,
        msg.guild,
        args.channel,
        guildData,
        args.category,
        args.role === 'off' ? undefined : args.role,
      );
      return msg.reply(t('commands:tkconfig.enable'));
    }

    if (args.option === 'disable') {
      await deleteAll(guildData, msg.guild);
      return msg.reply(t('commands:tkconfig.disable'));
    }

    if (args.option === 'channel') {
      if (guildData.data.ticket.channelId === args.channel.id) {
        return msg.reply(t('commands:tkconfig.already_current_main_channel', { channel: args.channel }));
      }

      const deleteOldMessage = async () => {
        if (guildData.data.ticket.messageId) {
          const oldChannel = msg.guild.channels.get(guildData.data.ticket.channelId);
          if (oldChannel && oldChannel instanceof TextChannel) {
            const sent = await oldChannel.fetchMessage(guildData.data.ticket.messageId).catch(() => null);
            if (sent) sent.delete();
          }
        }
      };

      deleteOldMessage();
      await setupMainChannel(t, msg.guild, args.channel, guildData);
      return msg.reply(t('commands:tkconfig.channel'));
    }

    if (args.option === 'change_category' || args.option === 'set_category') {
      const { ticket } = guildData.data;
      if (args.option === 'change_category' && ticket.categoryId === args.category.id) {
        return msg.reply(t('commands:tkconfig.already_current_category'));
      }
      await guildData.updateTicket({ categoryId: args.category.id });
      if (ticket.channelId) {
        const channel = msg.guild.channels.get(ticket.channelId);
        if (channel) channel.setParent(args.category);
      }
      if (ticket && ticket.tickets) {
        ticket.tickets.forEach(tk => {
          const channel = msg.guild.channels.get(tk.channelId);
          if (channel) {
            channel.setParent(args.category);
          }
        });
      }
      const text =
        args.option === 'change_category' ? 'commands:tkconfig.change_category' : 'commands:tkconfig.set_category';
      return msg.reply(text);
    }

    if (args.option === 'change_role' || args.option === 'set_role') {
      const { ticket } = guildData.data;
      if (args.option === 'change_role' && ticket.role === args.role.id) {
        return msg.reply(t('commands:tkconfig.already_current_role'));
      }
      await guildData.updateTicket({ role: args.role.id });
      return msg.reply(t('commands:tkconfig.role'));
    }
  }
}

export default SetChannelTkCommand;
