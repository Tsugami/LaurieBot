import { Message, Util, MessageReaction, User, DMChannel } from 'discord.js';

import Command, { TFunction } from '@struct/Command';
import Categories from '@struct/categories';
import LaurieEmbed from '@struct/LaurieEmbed';

class HelpCommand extends Command {
  notShow = ['bot', 'ticket'];

  constructor() {
    super('help', {
      category: 'bot',
      aliases: ['ajuda'],
    });
  }

  async run(msg: Message, t: TFunction) {
    let channel: DMChannel;

    function sendErrorMessage() {
      msg.reply(t('commands:help.failed_message'), {
        file: { attachment: 'assets/help.gif', name: 'help.gif' },
      });
    }

    if (msg.channel instanceof DMChannel) {
      channel = msg.channel;
    } else {
      try {
        channel = await msg.author.createDM();
      } catch (_) {
        return sendErrorMessage();
      }
    }

    const categories = Object.values(Categories).filter(x => !this.notShow.includes(x.id));
    const categoriesMainMessage = categories.map(c => `${c.emoji} ${t(`categories:${c.id}.description`)}`).join('\n');

    const embed = new LaurieEmbed(msg.author);
    embed.setDescription(`${t('commands:help.message', { author: msg.author })}\n\n${categoriesMainMessage}`);

    try {
      const sent = await channel.send(embed);
      if (sent instanceof Message) {
        await msg.reply(t('commands:help.warn_message'));

        const reactEmojis = async () => {
          // eslint-disable-next-line no-restricted-syntax
          for await (const category of categories) {
            const emoji = Util.parseEmoji(category.emoji);
            const id = emoji.id ? emoji.id : emoji.name;
            // eslint-disable-next-line no-await-in-loop
            await sent.react(id);
          }
        };

        reactEmojis();

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
    } catch (_) {
      sendErrorMessage();
    }
  }
}

export default HelpCommand;
