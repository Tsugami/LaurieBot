import Command from '@struct/command/Command';
import { guild } from '@database/index';
import FilterCommand from './filter';

export default new Command(
  'filterlist',
  {
    aliases: ['listfiltro'],
    category: 'configuration',
    channelRestriction: 'guild',
  },
  async function run(msg, t) {
    const { wordFilter } = await guild(msg.guild.id);
    const words = wordFilter.get().map(w => `\`${w}\``);

    if (words.length) {
      msg.reply(t('commands:filterlist.list', { words }));
    } else {
      msg.reply(
        t('commands:filterlist.emply_list', {
          command: `\`${this.getPrefix(msg) + FilterCommand.aliases[0]}\``,
        }),
      );
    }
  },
);
