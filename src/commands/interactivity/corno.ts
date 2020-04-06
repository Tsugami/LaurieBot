import Command from '@struct/command/Command';
import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';

export default new Command(
  'corno',
  {
    category: 'interactivity',
  },
  (msg, t) => {
    const num = getRandomInt(1, 100);
    msg.reply(t('commands:corno.message', { num, emoji: EMOJIS.OX }));
  },
);
