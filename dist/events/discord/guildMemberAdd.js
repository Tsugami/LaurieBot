"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');
var _discordjs = require('discord.js');
var _index = require('@database/index');

function parseWelcome(text, user, guildName) {
  return text.replace(/{{user}}/gi, user).replace(/{{guild}}/gi, guildName);
}

 class GuildMemberAddListener extends _discordakairo.Listener {
   __init() {this.DEFAULT_MESSAGE = '{{user}}, Bem Vindo ao {{guild}}.'}

  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      eventName: 'guildMemberAdd',
    });GuildMemberAddListener.prototype.__init.call(this);;
  }

  async exec(member) {
    const guildData = await _index.guild.call(void 0, member.guild.id);
    const { welcome } = guildData.data;
    if (welcome && welcome.message) {
      const channel = member.guild.channels.get(welcome.channelId);
      if (channel instanceof _discordjs.TextChannel) {
        channel.send(parseWelcome(welcome.message, member.user.username, member.guild.name));
      }
    }
  }
} exports.default = GuildMemberAddListener;
