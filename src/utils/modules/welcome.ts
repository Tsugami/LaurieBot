import { User, Guild, GuildMember, TextChannel } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
import locales from '@utils/locales';

export default class WelcomeUtil {
  static parseText(text: string, user: User, guild: Guild) {
    return text.replace(/{{user}}/gi, user.username).replace(/{{guild}}/gi, guild.name);
  }

  static async send(member: GuildMember) {
    const client = member.client as AkairoClient;
    const guildData = await client.database.getGuild(member.guild.id);
    const channel = guildData.welcome.channelId && member.guild.channels.cache.get(guildData.welcome.channelId);

    if (channel instanceof TextChannel) {
      channel.send(
        this.parseText(
          guildData.welcome.message || (await locales.getFixedT(member.guild))('modules:welcome.message_default'),
          member.user,
          member.guild,
        ),
      );
    }
  }
}
