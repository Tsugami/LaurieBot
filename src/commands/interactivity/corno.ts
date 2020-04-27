import LaurieCommand from '@structures/LaurieCommand';
import { range } from '@utils/utils';
import { EMOJIS } from '@utils/constants';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';
import Collection from '../../utils/collection';

export default class Corno extends LaurieCommand {
  cache = new Collection(50);

  constructor() {
    super('corno', {
      editable: true,
      category: 'interactivity',
    });
  }

  exec(msg: Message) {
    let num;
    if (this.cache.has(msg.author.id)) {
      num = this.cache.get(msg.author.id);
    } else {
      num = range(1, 100);
      this.cache.set(msg.author.id, num);
    }
    msg.util?.reply(new LaurieEmbed(null, msg.t('commands:corno.message', { num, emoji: EMOJIS.OX })));
  }
}
