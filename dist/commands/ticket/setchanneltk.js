"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable @typescript-eslint/camelcase */








var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);
var _discordjs = require('discord.js');

var _setupMainChannel = require('@ticket/setupMainChannel');
var _deleteAllHandler = require('@ticket/deleteAllHandler'); var _deleteAllHandler2 = _interopRequireDefault(_deleteAllHandler);

































const options = _Command.defineOptions.call(void 0, [
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'commands:setchanneltk.args.option.enable',
    parse: (msg, a) =>
      !a.guildData.data.ticket ||
      !a.guildData.data.ticket.active ||
      !msg.guild.channels.has(a.guildData.data.ticket.channelId),
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'commands:setchanneltk.args.option.disable',
    parse: (_, a) => !!(a.guildData.data.ticket && a.guildData.data.ticket.active),
  },
  {
    key: 'channel',
    aliases: ['canal', 'alterar channel'],
    message: 'commands:setchanneltk.args.option.channel',
    parse: (_, a) => !!(a.guildData.data.ticket && a.guildData.data.ticket.active),
  },
  {
    key: 'set_category',
    aliases: ['categoria'],
    message: 'commands:setchanneltk.args.option.set_category',
    parse: (msg, a) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && (!ticket.categoryId || !msg.guild.roles.has(ticket.categoryId)));
    },
  },
  {
    key: 'change_category',
    aliases: ['categoria'],
    message: 'commands:setchanneltk.args.option.set_category',
    parse: (msg, a) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && ticket.categoryId && msg.guild.channels.has(ticket.categoryId));
    },
  },
  {
    key: 'set_role',
    aliases: ['setar cargo'],
    message: 'commands:setchanneltk.args.option.set_role',
    parse: (msg, a) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && (!ticket.role || !msg.guild.roles.has(ticket.role)));
    },
  },
  {
    key: 'change_role',
    aliases: ['alterar cargo'],
    message: 'commands:setchanneltk.args.option.change_role',
    parse: (msg, a) => {
      const { ticket } = a.guildData.data;
      return !!(ticket && ticket.active && ticket.role && msg.guild.roles.has(ticket.role));
    },
  },
]);



class SetChannelTkCommand extends _Command2.default {
  constructor() {
    super('setcanaltk', {
      aliases: ['setcanaltk'],
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      category: 'ticket',
      channelRestriction: 'guild',
      args: [
        _Command.guildDataArg,
        _Command.optionsArg.call(void 0, 'option', options, _Command.Prompt.call(void 0, 'commons:choose_option')),
        {
          id: 'channel',
          type: (word, msg, args) =>
            _Command.getArgumentAkairo(this.client, args.option, [[['channel', 'enable'], 'textChannel']])(
              word,
              msg,
              args,
            ),
          prompt: {
            start: _Command.Prompt.call(void 0, 'commands:setchanneltk.args.channel.start'),
            retry: _Command.Prompt.call(void 0, 'commands:setchanneltk.args.channel.retry'),
          },
        },
        {
          id: 'category',
          type: (word, msg, args) => {
            const channel = _Command.getArgumentAkairo(this.client, args.option, [
              [['change_category', 'enable', 'set_category'], 'channel'],
            ])(word, msg, args);
            if (channel instanceof _discordjs.Channel) {
              if (channel instanceof _discordjs.CategoryChannel) return channel;
              return null;
            }
            return channel;
          },
          prompt: {
            start: _Command.PromptOptions.call(void 0, {
              enable: 'commands:setchanneltk.args.category.start.enable',
              change_category: 'commands:setchanneltk.args.category.start.change_category',
              set_category: 'commands:setchanneltk.args.category.start.set_category',
            }),
            retry: _Command.Prompt.call(void 0, 'commands:setchanneltk.args.category.retry'),
          },
        },
        {
          id: 'role',
          type: (word, msg, args) => {
            if (args.option === 'enable' && word === 'off') return 'off';
            return _Command.getArgumentAkairo(this.client, args.option, [
              [['enable', 'change_role', 'set_role'], 'role'],
            ])(word, msg, args);
          },
          prompt: {
            start: _Command.PromptOptions.call(void 0, {
              enable: 'commands:setchanneltk.args.enable.start.enable',
              change_role: 'commands:setchanneltk.args.role.start.change_role',
              set_role: 'commands:setchanneltk.args.role.start.set_role',
            }),
            retry: _Command.Prompt.call(void 0, 'commands:setchanneltk.args.role.retry'),
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: _Command.Prompt.call(void 0, 'commons:cancel'),
      },
    });
  }

  async run(msg, t, args) {
    const { guildData } = args;
    if (args.option === 'enable') {
      await _setupMainChannel.setupMainChannel.call(void 0, 
        t,
        msg.guild,
        args.channel,
        guildData,
        args.category,
        args.role === 'off' ? undefined : args.role,
      );
      return msg.reply(t('commands:setchanneltk.enable'));
    }

    if (args.option === 'disable') {
      await _deleteAllHandler2.default.call(void 0, guildData, msg.guild);
      return msg.reply(t('commands:setchanneltk.disable'));
    }

    if (args.option === 'channel') {
      if (guildData.data.ticket.channelId === args.channel.id) {
        return msg.reply(t('commands:setchanneltk.already_current_main_channel', { channel: args.channel }));
      }

      const deleteOldMessage = async () => {
        if (guildData.data.ticket.messageId) {
          const oldChannel = msg.guild.channels.get(guildData.data.ticket.channelId);
          if (oldChannel && oldChannel instanceof _discordjs.TextChannel) {
            const sent = await oldChannel.fetchMessage(guildData.data.ticket.messageId).catch(() => null);
            if (sent) sent.delete();
          }
        }
      };

      deleteOldMessage();
      await _setupMainChannel.setupMainChannel.call(void 0, t, msg.guild, args.channel, guildData);
      return msg.reply(t('commands:setchanneltk.channel'));
    }

    if (args.option === 'change_category' || args.option === 'set_category') {
      const { ticket } = guildData.data;
      if (args.option === 'change_category' && ticket.categoryId === args.category.id) {
        return msg.reply(t('commands:setchanneltk.already_current_category'));
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
        args.option === 'change_category'
          ? 'commands:setchanneltk.change_category'
          : 'commands:setchanneltk.set_category';
      return msg.reply(text);
    }

    if (args.option === 'change_role' || args.option === 'set_role') {
      const { ticket } = guildData.data;
      if (args.option === 'change_role' && ticket.role === args.role.id) {
        return msg.reply(t('commands:setchanneltk.already_current_role'));
      }
      await guildData.updateTicket({ role: args.role.id });
      return msg.reply(t('commands:setchanneltk.role'));
    }
  }
}

exports. default = SetChannelTkCommand;
