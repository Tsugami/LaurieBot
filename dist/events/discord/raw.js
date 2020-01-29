"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');
var _discordjs = require('discord.js');
var _index = require('@database/index');
var _TicketUtil = require('@ticket/TicketUtil');

 class RawListener extends _discordakairo.Listener {
  constructor() {
    super('raw', {
      emitter: 'client',
      eventName: 'raw',
    });
  }

  async exec(packet) {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;

    const { client } = this;
    const user = client.users.get(packet.d.user_id);

    if (!user || user.bot || !_TicketUtil.isTicketEmoji.call(void 0, packet.d.emoji.name)) return;

    const guildData = await _index.guild.call(void 0, packet.d.guild_id);

    if (!guildData.data.ticket || guildData.data.ticket.messageId !== packet.d.message_id) return;

    const channel = client.channels.get(packet.d.channel_id);

    if (channel instanceof _discordjs.TextChannel) {
      if (channel.messages.has(packet.d.message_id)) return;

      const message = await channel.fetchMessage(packet.d.message_id).catch(() => null);

      if (message instanceof _discordjs.Message) {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) {
          const user = client.users.get(packet.d.user_id);
          if (user) reaction.users.set(packet.d.user_id, user);
        }

        if (packet.t === 'MESSAGE_REACTION_ADD') {
          client.emit('messageReactionAdd', reaction, client.users.get(packet.d.user_id));
        }
      }
    }
  }
} exports.default = RawListener;
