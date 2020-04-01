import { Message } from 'discord.js';

import Command, { TFunction } from '@struct/Command';
import { guild } from '@database/index';
import FilterCommand from './filter';

class CommandsCommand extends Command {
  constructor() {
    super('filterlist', {
      aliases: ['listfiltro'],
      category: 'configuration',
      help: 'listfiltro',
      channelRestriction: 'guild',
    });
  }

  async run(msg: Message, t: TFunction) {
    const { wordFilter } = await guild(msg.guild.id);
    const words = wordFilter.get().map(w => `\`${w}\``);

    if (words.length) {
      msg.reply(t('commands:filterlist.list', { words }));
    } else {
      msg.reply(t('commands:filterlist.emply_list', { command: `\`${this.getPrefix(msg) + FilterCommand.help}\`` }));
    }
  }
}

export default CommandsCommand;
