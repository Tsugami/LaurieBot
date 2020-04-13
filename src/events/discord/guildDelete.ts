import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';
import { EMOJIS } from '@utils/Constants';

export default class GuildDeleteListener extends Listener {
  constructor() {
    super('guildDelete', {
      emitter: 'client',
      eventName: 'guildDelete',
    });
  }

  async exec(guild: Guild) {
    const channel = this.client.channels.get(String(process.env.J_L_LOG_CHANNEL));
    if (channel instanceof TextChannel) {
      channel.send(
        `${EMOJIS.BAD_LOG} Sair do servidor \`${guild.name} [${guild.id}]\`. (Atualmente estou em ${this.client.guilds.size})`,
      );
    }
  }
}
