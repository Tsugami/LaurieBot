"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');
var _index = require('@database/index');

exports. default = new (0, _discordakairo.Inhibitor)(
  'commands',
  async (msg, commmand) => {
    if (msg.guild && !msg.member.permissions.has('ADMINISTRATOR') && commmand && commmand.id !== 'commands') {
      const guildData = await _index.guild.call(void 0, msg.guild.id);
      const result = guildData.data.disableChannels.includes(msg.channel.id);
      if (result) return Promise.reject('blocked');
    }
  },
  {
    category: 'general',
    reason: 'disableCommands',
  },
);
