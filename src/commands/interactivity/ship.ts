import { Message, User, Attachment } from 'discord.js';
import Command, { TFunction } from '@struct/Command';

import { ship2 } from '@utils/Jimp';

interface ArgsI {
  user1: User;
  user2: User;
}

class ShipCommand extends Command {
  constructor() {
    super('ship', {
      aliases: ['ship', 'shippar'],
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
    });
  }

  async run(msg: Message, t, args: ArgsI) {
    const { buffer } = await ship2(args.user1, args.user2);
    const attch = new Attachment(buffer, 'ship.png');
    return msg.reply(attch);
  }
}

export default ShipCommand;
