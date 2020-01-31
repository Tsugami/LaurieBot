import { Message, Util, MessageReaction, User } from 'discord.js';

import Command, { TFunction } from '@struct/Command';
import Categories from '@struct/categories';
import Embed from '@utils/Embed';

interface ArgsI {
  command: Command | null;
}

class HelpCommand extends Command {
  constructor() {
    super('help', {
      category: 'bot',
      aliases: ['help', 'ajuda'],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const { command } = args;
    if (!command) {
      const categories = Object.values(Categories).filter(x => x.id !== 'bot');
      const categoriesMainMessage = categories.map(c => `${c.emoji} ${t(`categories:${c.id}.description`)}`).join('\n');

      const embed = new Embed(msg.author);
      embed.setDescription(`${t('commands:help.message', { author: msg.author })}\n\n${categoriesMainMessage}`);
      const sent = await msg.reply(embed);

      if (sent instanceof Message) {
        categories.forEach(category => {
          const emoji = Util.parseEmoji(category.emoji);
          const id = emoji.id ? emoji.id : emoji.name;
          sent.react(id);
        });

        let currentCategoryId: string;
        const filter = (r: MessageReaction, u: User) => u.id === msg.author.id && r.me;

        const colector = sent.createReactionCollector(filter);

        embed.setDescription('');
        colector.on('collect', e => {
          e.remove(msg.author);
          const category = categories.find(c => c.emoji === e.emoji.toString());
          if (category && category.id !== currentCategoryId) {
            currentCategoryId = category.id;
            embed.fields = [];
            embed.setTitle(t(`categories:${category.id}.name`));
            category.forEach(c => embed.addField(`${c.toTitle(t)}`, `${t(`commands:${c.id}.description`)}`));
            sent.edit(embed);
          }
        });
      }
    }
  }
}

export default HelpCommand;
