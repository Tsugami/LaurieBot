import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class DisabledChannel extends Inhibitor {
  constructor() {
    super('disabledChannel', {
      reason: 'disabledChannel',
    });
  }

  async exec(msg: Message) {
    if (!msg.guild) return false;
    const guildData = await this.client.database.getGuild(msg.guild.id);
    return guildData.disabledChannels.includes(msg.channel.id);
  }
}
