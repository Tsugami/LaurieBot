"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');

var _index = require('@database/index');
var _TicketUtil = require('@ticket/TicketUtil');

 class MessageListener extends _discordakairo.Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      eventName: 'message',
    });
  }

  async exec(msg) {
    if (msg.guild) {
      const guildData = await _index.guild.call(void 0, msg.guild.id);

      if (!msg.author.bot) _TicketUtil.addUserList.call(void 0, msg, guildData);
      if (_TicketUtil.isMainChannel.call(void 0, msg, guildData)) {
        msg.delete();
      }
    }
  }
} exports.default = MessageListener;
