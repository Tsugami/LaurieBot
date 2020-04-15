import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { sendWelcomeMessage } from '@utils/ModuleUtils';

export default class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      eventName: 'guildMemberAdd',
    });
  }

  async exec(member: GuildMember) {
    sendWelcomeMessage(member);
  }
}
