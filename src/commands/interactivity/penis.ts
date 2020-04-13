import Command from '@struct/command/Command';
import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';
import QuickUrl from 'quick-lru';

const penisCache = new QuickUrl<string, number>({ maxSize: 50 });
export default new Command(
  'penis',
  {
    aliases: ['pau'],
    category: 'interactivity',
  },
  (msg, t) => {
    let num: number;
    if (penisCache.has(msg.author.id)) {
      num = penisCache.get(msg.author.id) as number;
    } else {
      num = getRandomInt(1, 100);
      penisCache.set(msg.author.id, num);
    }

    let emoji: string;

    if (num < 10) {
      emoji = EMOJIS.PINCHING_HAND;
    } else if (num > 23) {
      emoji = EMOJIS.LUL;
    } else {
      emoji = EMOJIS.JOIA;
    }

    msg.reply(t('commands:penis.message', { emoji, num }));
  },
);
