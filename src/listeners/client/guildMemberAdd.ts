import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import WelcomeUtil from '@utils/modules/welcome';

export default class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
    });
  }

  async exec(member: GuildMember) {
    WelcomeUtil.send(member);
  }
}
