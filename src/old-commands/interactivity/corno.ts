import Command from '@struct/command/Command';
import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';
import QuickUrl from 'quick-lru';
import LaurieEmbed from '@struct/LaurieEmbed';

const cornosCache = new QuickUrl({ maxSize: 50 });
export default new Command(
  'corno',
  {
    category: 'interactivity',
  },
  (msg, t) => {
    let num;
    if (cornosCache.has(msg.author.id)) {
      num = cornosCache.get(msg.author.id);
    } else {
      num = getRandomInt(1, 100);
      cornosCache.set(msg.author.id, num);
    }
    msg.reply(new LaurieEmbed(null, t('commands:corno.message', { num, emoji: EMOJIS.OX })));
  },
);
