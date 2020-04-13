import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';
import { EMOJIS } from '@utils/Constants';

export default class GuildCreateAddListener extends Listener {
  constructor() {
    super('guildCreate', {
      emitter: 'client',
      eventName: 'guildCreate',
    });
  }

  async exec(guild: Guild) {
    const channel = this.client.channels.get(String(process.env.J_L_LOG_CHANNEL));
    if (channel instanceof TextChannel) {
      channel.send(
        `${EMOJIS.GOOD_LOG} Entrei do servidor \`${guild.name} [${guild.id}]\`.  (Atualmente estou em ${this.client.guilds.size})`,
      );
    }
  }
}
