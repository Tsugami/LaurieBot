import Command, { TFunction } from '@struct/Command';

import { Message, Attachment } from 'discord.js';
import { getAwardImage } from '@services/minecraft';

interface ArgsI {
  text: string;
}

class McConquistaCommand extends Command {
  constructor() {
    super('mcconquista', {
      aliases: ['mcconquista'],
      category: 'minecraft',
      args: [
        {
          id: 'text',
          type: 'string',
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const image = getAwardImage(t('commands:mcconquista.message'), args.text);
    msg.reply(new Attachment(image, 'image.png'));
  }
}

export default McConquistaCommand;
