import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import { guild } from '@database/index';
import { isTicketEmoji } from '@ticket/TicketUtil';

export default class extends Listener {
  constructor() {
    super('raw', {
      emitter: 'client',
      eventName: 'raw',
    });
  }

  async exec(packet: any) {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;

    const { client } = this;
    const user = client.users.get(packet.d.user_id);

    if (!user || user.bot || !isTicketEmoji(packet.d.emoji.name)) return;

    const guildData = await guild(packet.d.guild_id);

    if (!guildData.data.ticket || guildData.data.ticket.messageId !== packet.d.message_id) return;

    const channel = client.channels.get(packet.d.channel_id);

    if (channel instanceof TextChannel) {
      if (channel.messages.has(packet.d.message_id)) return;

      const message = await channel.fetchMessage(packet.d.message_id).catch(() => null);

      if (message instanceof Message) {
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
}
