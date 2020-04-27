import Command from '@structures/LaurieCommand';
import { Message, Guild } from 'discord.js';

export default class FilterList extends Command {
  constructor() {
    super('filterlist', {
      editable: false,
      aliases: ['listfiltro'],
      category: 'configuration',
      lock: 'guild',
    });
  }

  async exec(msg: Message) {
    const { wordFilter } = await this.client.database.getGuild((msg.guild as Guild).id);
    const words = wordFilter.get().map(w => `\`${w}\``);

    if (words.length) {
      msg.reply(msg.t('commands:filterlist.list', { words }));
    } else {
      msg.reply(
        msg.t('commands:filterlist.emply_list', {
          command: `\`${msg.util?.parsed?.prefix + this.handler.findCommand('filter').help}\``,
        }),
      );
    }
  }
}
