import Command, { TFunction, Prompt } from '@struct/Command';

import { Message, Attachment } from 'discord.js';
import { getAwardImage } from '@services/minecraft';

interface ArgsI {
  message: string;
}

class McConquistaCommand extends Command {
  constructor() {
    super('mcconquista', {
      aliases: ['mcconquista'],
      category: 'minecraft',
      help: 'mcconquista',
      args: [
        {
          id: 'message',
          match: 'text',
          type: 'string',
          prompt: {
            start: Prompt('commands:mcconquista.args.message.start'),
            retry: Prompt('commands:mcconquista.args.message.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const image = getAwardImage(t('commands:mcconquista.message'), args.message);
    msg.reply(new Attachment(image, 'image.png'));
  }
}

export default McConquistaCommand;
