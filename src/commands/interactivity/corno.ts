import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';

import { getRandomInt } from '@utils/Math';
import { EMOJIS } from '@utils/Constants';

class CornoCommand extends Command {
  constructor() {
    super('corno', {
      category: 'interactivity',
    });
  }

  run(msg: Message, t: TFunction) {
    const num = getRandomInt(1, 100);
    msg.reply(t('commands:corno.message', { num, emoji: EMOJIS.OX }));
  }
}

export default CornoCommand;
