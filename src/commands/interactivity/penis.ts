import Command, { TFunction } from '@struct/Command';

import { Message } from 'discord.js';

import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';

class PenisCommand extends Command {
  constructor() {
    super('penis', {
      aliases: ['pau'],
      category: 'interactivity',
    });
  }

  run(msg: Message, t: TFunction) {
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
  }
}

export default PenisCommand;
