import { Inhibitor } from 'discord-akairo';
import locales from '@utils/locales';
import { Message } from 'discord.js';

export default class Context extends Inhibitor {
  constructor() {
    super('context', {
      priority: 1,
    });
  }

  async exec(msg: Message) {
    msg.t = await locales.getFixedT(msg);
    return false;
  }
}
