import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';
import { EMOJIS } from '@utils/Constants';
import LaurieEmbed from '../../struct/LaurieEmbed';

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
      const embed = new LaurieEmbed()
        .setColor('GREEN')
        .setTitle(`${EMOJIS.GOOD_LOG} Entrei no servidor ${guild.name}`)
        .addField('ID', guild.id, true)
        .addField('USERS', guild.members.size, true)
        .addField('OWNER', `${guild.owner.user.tag} (${guild.owner.user.id})`)
        .addField('CURRENT GUILDS', this.client.guilds.size, true);
      if (guild.iconURL) embed.setThumbnail(guild.iconURL);
      channel.send(embed);
    }
  }
}
