import { Message, Util, MessageReaction, User, DMChannel } from 'discord.js';

import Command, { TFunction } from '@struct/Command';
import Categories from '@struct/categories';
import Embed from '@utils/Embed';

class HelpCommand extends Command {
  constructor() {
    super('help', {
      category: 'bot',
      help: 'ajuda',
      aliases: ['help', 'ajuda'],
    });
  }

  async run(msg: Message, t: TFunction) {
    let dm: DMChannel;
    try {
      dm = await msg.author.createDM();
    } catch (_) {
      return msg.reply(t('commands:help.failed_message'), {
        file: { attachment: 'assets/help.gif', name: 'help.gif' },
      });
    }
    if (msg.channel.type !== 'dm') await msg.reply(t('commands:help.warn_message'));

    const categories = Object.values(Categories).filter(x => x.id !== 'bot');
    const categoriesMainMessage = categories.map(c => `${c.emoji} ${t(`categories:${c.id}.description`)}`).join('\n');

    const embed = new Embed(msg.author);
    embed.setDescription(`${t('commands:help.message', { author: msg.author })}\n\n${categoriesMainMessage}`);
    const sent = await dm.send(embed);

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

export default HelpCommand;
