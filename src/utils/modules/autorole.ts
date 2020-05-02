import { GuildMember } from 'discord.js';
import { AkairoClient } from 'discord-akairo';

export default class AutoroleUtil {
  static async addRole(member: GuildMember) {
    const client = member.client as AkairoClient;
    const guildData = await client.database.getGuild(member.guild.id);

    if (guildData.autoroleID) {
      member.roles.add(guildData.autoroleID);
    }
  }
}
