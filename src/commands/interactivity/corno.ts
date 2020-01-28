import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';

import { getRandomInt } from '@utils/Math';
import { Emojis } from '@utils/Constants';

class CornoCommand extends Command {
  constructor() {
    super('corno', {
      aliases: ['corno'],
      category: 'interactivity',
    });
  }

  run(msg: Message, t: TFunction) {
    const num = getRandomInt(1, 100);
    msg.reply(t('commands:corno.message', { num, emoji: Emojis.OX }));
  }
}

export default CornoCommand;
