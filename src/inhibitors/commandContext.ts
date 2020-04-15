import { Inhibitor } from 'discord-akairo';
import { getFixedT } from '@utils/locales';
import { Message } from 'discord.js';

export default class Context extends Inhibitor {
  constructor() {
    super('context', {
      priority: 1,
    });
  }

  exec(msg: Message) {
    msg.t = getFixedT(msg);
    return false;
  }
}

declare module 'discord.js' {
  interface Message {
    t: ReturnType<typeof getFixedT>;
  }
}
