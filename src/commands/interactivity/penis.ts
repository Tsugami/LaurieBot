import Command from '@struct/command/Command';
import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';

export default new Command(
  'penis',
  {
    aliases: ['pau'],
    category: 'interactivity',
  },
  (msg, t) => {
    const num = getRandomInt(1, 30);
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
