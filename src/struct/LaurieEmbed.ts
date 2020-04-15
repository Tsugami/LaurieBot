import { MessageEmbed, User } from 'discord.js';
import { capitalize } from '@utils/Utils';
import { EMBED_DEFAULT_COLOR, EMOJIS, EmojiType } from '../utils/Constants';

type EmojiNames = keyof typeof EMOJIS | EmojiType;
type InfoTextField = [EmojiNames, string, string | number, boolean?];

export default class LaurieEmbed extends MessageEmbed {
  constructor(author?: User | null, title?: string, description?: string) {
    super();
    if (title) this.setTitle(capitalize(title));
    if (description) this.setDescription(description);
    if (author) {
      this.setFooter(`Por ${author.username}`, author.displayAvatarURL());
      this.setTimestamp();
    }
    this.setColor(EMBED_DEFAULT_COLOR);
  }

  addFields(fields: Array<[string, string, boolean?]>) {
    fields.forEach(f => this.addField(f[0], f[1], f[2]));
    return this;
  }

  addInfoText(titleEmoji: EmojiNames, title: string, ...fields: InfoTextField[]) {
    if (!this.description) this.description = '';

    if (this.description.length) {
      this.description += '\n';
    }

    const getEmoji = (emoji: EmojiNames): EmojiType => {
      return EMOJIS[emoji] || emoji;
    };

    this.description += `${getEmoji(titleEmoji)} **${title.toUpperCase()}**\n\n`;

    // eslint-disable-next-line no-restricted-syntax
    for (const [emojiName, key, value, skip = true] of fields) {
      this.description += `${getEmoji(emojiName)} **${key}**: ${value}${skip ? '\n' : ''}`;
    }
    return this;
  }
}
