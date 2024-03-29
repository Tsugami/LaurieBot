import { Message, Util, MessageReaction, User, DMChannel, TextChannel, MessageAttachment } from 'discord.js';

import Command from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { CATEGORIES_EMOJIS } from '../../utils/constants';

const CATEGORIES_HIDDEN = ['bot', 'ticket'];

export default class Help extends Command {
  constructor() {
    super('help', {
      aliases: ['ajuda'],
      category: 'bot',
      editable: false,
    });
  }

  async exec(msg: Message) {
    const isLocked = () => {
      msg.reply(msg.t('commands:help.failed_message'), new MessageAttachment('assets/help.gif', 'help.gif'));
    };

    let dm = msg.channel as DMChannel;
    if (msg.channel instanceof TextChannel) {
      try {
        dm = await msg.author.createDM();
      } catch {
        return isLocked();
      }
    }

    const categories = this.handler.categories.filter(x => !CATEGORIES_HIDDEN.includes(x.id));
    const categoriesMainMessage = categories
      .map(c => `${CATEGORIES_EMOJIS[c.id]} __${msg.t(`categories:${c.id}.description`)}__`)
      .join('\n');

    const content = msg.t(`${this.tPath}.message`, { author: `${msg.author}` });
    const embed = new LaurieEmbed(
      msg.author,
      msg.t(`${this.tPath}.embed_title`),
      `**${msg.t(`${this.tPath}.categories`).toUpperCase()}**\n${categoriesMainMessage}`,
    ).setThumbnail(this.client.user?.displayAvatarURL() as string);
    let sent: Message;
    try {
      sent = await dm.send(content, { embed, disableMentions: 'none' });
      if (msg.channel.type === 'text') {
        msg.reply(new LaurieEmbed(msg.author, msg.t(`${this.tPath}.warn_message`)));
      }
    } catch {
      return isLocked();
    }

    const reactEmojis = async () => {
      for await (const category of categories.array()) {
        const emoji = Util.parseEmoji(CATEGORIES_EMOJIS[category.id]);
        if (emoji) {
          const id = emoji.id ? emoji.id : emoji.name;
          await sent.react(id);
        }
      }
    };

    reactEmojis();

    let currentCategoryId: string;
    const filter = (r: MessageReaction, u: User) => u.id === msg.author.id && r.me;

    const colector = sent.createReactionCollector(filter);

    embed.setDescription('');
    colector.on('collect', e => {
      const category = categories.find(c => CATEGORIES_EMOJIS[c.id] === e.emoji.toString());
      if (category && category.id !== currentCategoryId) {
        currentCategoryId = category.id;
        embed.fields = [];
        embed.setTitle(msg.t(`categories:${category.id}.name`));
        category.forEach(c => embed.addField(`${c.getTitle(msg.t)}`, `${msg.t(c.description)}`));
        sent.edit(embed);
      }
    });
  }
}
