import { RichEmbed, User } from 'discord.js';
import { EMBED_DEFAULT_COLOR } from './Constants';

export default class Embed extends RichEmbed {
  constructor(author: User) {
    super();
    this.setFooter(`Por ${author.username}`, author.displayAvatarURL);
    this.setColor(EMBED_DEFAULT_COLOR);
    this.setTimestamp();
  }

  addFields(fields: Array<[string, string, boolean?]>) {
    fields.forEach(f => this.addField(f[0], f[1], f[2]));
    return this;
  }
}
