import { Attachment } from 'discord.js';
import Command from '@struct/command/Command';

import { ship2 } from '@utils/Jimp';

export default new Command(
  'ship',
  {
    aliases: ['shippar'],
    category: 'interactivity',
    args: [
      {
        type: 'user',
        id: 'user1',
        prompt: {
          start: 'quem você quer shipar?',
        },
      },
      {
        type: 'user',
        id: 'user2',
        prompt: {
          start: 'com quem você quer shipar?',
        },
      },
    ],
  },
  async (msg, t, args) => {
    const { buffer } = await ship2(args.user1, args.user2);
    const attch = new Attachment(buffer, 'ship.png');
    return msg.reply(attch);
  },
);
