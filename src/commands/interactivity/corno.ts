import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

import { Interactivity } from '../../categories';
import { getRandomInt } from '../../utils/Math';
import { Emojis } from '../../utils/Constants';

class CornoCommand extends Command {
  constructor() {
    super('corno', {
      aliases: ['corno'],
      category: Interactivity,
    });
  }

  exec (msg: Message) {
    const result = getRandomInt(1, 100)
    msg.reply(`você é ${result}% corno. ${Emojis.OX}`);
  }
}

export default CornoCommand;
