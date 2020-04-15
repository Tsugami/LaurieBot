import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';
import { EMOJIS } from '@utils/constants';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class GuildDeleteListener extends Listener {
  constructor() {
    super('guildDelete', {
      emitter: 'client',
      event: 'guildDelete',
    });
  }

  async exec(guild: Guild) {
    const channel = this.client.channels.cache.get(String(process.env.J_L_LOG_CHANNEL));
    if (channel instanceof TextChannel) {
      const embed = new LaurieEmbed()
        .setColor('RED')
        .setTitle(`${EMOJIS.BAD_LOG} Sair do servidor ${guild.name}`)
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
