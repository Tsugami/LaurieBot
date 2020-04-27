import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';

export default class FilterWords extends Inhibitor {
  constructor() {
    super('filterWords', {
      reason: 'filterWords',
    });
  }

  async exec(msg: Message) {
    if (!msg.guild) return false;
    const guildData = await this.client.database.getGuild(msg.guild.id);
    if (guildData.wordFilter.get().some(w => msg.content?.toLowerCase().includes(w))) {
      msg.delete();
      msg.reply(msg.t('modules:filter.message_default', { command: `\`${process.env.BOT_PREFIX}listfiltro\`` }));
      return true;
    }
    return false;
  }
}
