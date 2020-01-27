import { Emojis } from './Constants';

class Text {
  private description = '';

  addTitle(emoji: Emojis, title: string) {
    this.description += `${emoji} **${title}**\n\n`;
    return this;
  }

  addField(emoji: Emojis, key: string, value: string | number, skip = true) {
    this.description += `${emoji} **${key}**: ${value}`;
    if (skip) this.skip();
    return this;
  }

  skip() {
    this.description += '\n';
    return this;
  }

  get desc() {
    return this.description;
  }

  toString() {
    return this.description;
  }

  toJSON() {
    return this.description;
  }
}

export default Text;
