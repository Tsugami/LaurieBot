import LaurieCommand from '@structures/LaurieCommand';
import { Message, MessageAttachment } from 'discord.js';

import { getAwardImage } from '@services/minecraft';

export default class Mcconquista extends LaurieCommand {
  constructor() {
    super('mcconquista', {
      editable: true,
      category: 'minecraft',
      args: [
        {
          id: 'text',
          match: 'text',
          type: 'string',
          prompt: {
            start: (m: Message) => m.t('commands:mcconquista.args.text.start'),
            retry: (m: Message) => m.t('commands:mcconquista.args.text.retry'),
          },
        },
      ],
    });
  }

  exec(msg: Message, { text }: { text: string }) {
    const image = getAwardImage(msg.t('commands:mcconquista.message'), text);
    msg.reply(new MessageAttachment(image, 'image.png'));
  }
}
