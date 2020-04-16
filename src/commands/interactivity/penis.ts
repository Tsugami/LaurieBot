import LaurieCommand from '@structures/LaurieCommand';
import { range } from '@utils/utils';
import { EMOJIS } from '@utils/constants';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';
import Collection from '../../utils/collection';

export default class Penis extends LaurieCommand {
  cache = new Collection<string, number>(50);

  constructor() {
    super('penis', {
      category: 'interactivity',
      aliases: ['pau'],
    });
  }

  exec(msg: Message) {
    let num: number;
    if (this.cache.has(msg.author.id)) {
      num = this.cache.get(msg.author.id) as number;
    } else {
      num = range(1, 100);
      this.cache.set(msg.author.id, num);
    }

    let emoji: string;

    if (num < 10) {
      emoji = EMOJIS.PINCHING_HAND;
    } else if (num > 23) {
      emoji = EMOJIS.LUL;
    } else {
      emoji = EMOJIS.JOIA;
    }

    msg.util?.reply(new LaurieEmbed(null, msg.t('commands:penis.message', { emoji, num })));
  }
}
