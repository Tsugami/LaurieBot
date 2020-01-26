import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Interactivity } from '@categories';
import { getRandomInt } from '@utils/Math';
import { Emojis } from '@utils/Constants';

class PenisCommand extends Command {
  constructor() {
    super('penis', {
      aliases: ['penis', 'pau'],
      category: Interactivity,
    });
  }

  exec (msg: Message) {
    const result = getRandomInt(1, 30)
    let emoji: string

    if (result < 10) {
      emoji = Emojis.PINCHING_HAND
    } else if (result > 23) {
      emoji = Emojis.LUL
    } else {
      emoji = Emojis.JOIA
    }

    msg.reply(`seu pau tem ${result} centímetros. ${emoji}`);
  }
}

export default PenisCommand;
