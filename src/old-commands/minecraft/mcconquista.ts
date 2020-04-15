import Command from '@struct/command/Command';

import { Attachment } from 'discord.js';
import { getAwardImage } from '@services/minecraft';

export default new Command(
  'mcconquista',
  {
    category: 'minecraft',
    args: [
      {
        id: 'message',
        match: 'text',
        type: 'string',
      },
    ],
  },
  (msg, t, args) => {
    const image = getAwardImage(t('commands:mcconquista.message'), args.message);
    msg.reply(new Attachment(image, 'image.png'));
  },
);
