import { Listener } from 'discord-akairo';
import { GuildMember, TextChannel } from 'discord.js';
import { guild } from '@database/index';

function parseWelcome(text: string, user: string, guildName: string) {
  return text.replace(/{{user}}/gi, user).replace(/{{guild}}/gi, guildName);
}

export default class GuildMemberAddListener extends Listener {
  readonly DEFAULT_MESSAGE: string = '{{user}}, Bem Vindo ao {{guild}}.';

  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      eventName: 'guildMemberAdd',
    });
  }

  async exec(member: GuildMember) {
    const guildData = await guild(member.guild.id);
    const welcome = guildData.data.welcome.filter(x => x.active);
    for (const data of welcome) {
      const channel = member.guild.channels.get(data.channelId);
      if (channel && channel instanceof TextChannel) {
        const msg = data.message || this.DEFAULT_MESSAGE;
        channel.send(parseWelcome(msg, member.toString(), guild.name));
      }
    }
  }
}
