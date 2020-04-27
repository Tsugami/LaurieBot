import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';
import { EMOJIS } from '@utils/constants';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class GuildCreateAddListener extends Listener {
  constructor() {
    super('guildCreate', {
      emitter: 'client',
      event: 'guildCreate',
    });
  }

  async exec(guild: Guild) {
    const channel = this.client.channels.cache.get(String(process.env.J_L_LOG_CHANNEL));
    if (channel instanceof TextChannel) {
      const embed = new LaurieEmbed()
        .setColor('GREEN')
        .setTitle(`${EMOJIS.GOOD_LOG} Entrei no servidor ${guild.name}`)
        .addField('ID', guild.id, true)
        .addField('USERS', guild.members.cache.size, true)
        .addField('OWNER', `${guild.owner?.user.tag} (${guild.owner?.user.id})`)
        .addField('CURRENT GUILDS', this.client.guilds.cache.size, true);
      const iconURL = guild.iconURL();
      if (iconURL) embed.setThumbnail(iconURL);
      channel.send(embed);
    }
  }
}
