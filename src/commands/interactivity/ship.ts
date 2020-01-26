import { Command } from 'discord-akairo';
import { Message, User, Attachment } from 'discord.js';

import { Interactivity } from '@categories';
import { ship2 } from '@utils/Jimp';

interface ArgsI {
  user1: User;
  user2: User;
}

class ShipCommand extends Command {
  constructor() {
    super('ship', {
      aliases: ['ship', 'shippar'],
      category: Interactivity,
      args: [
        {
          type: 'user',
          id: 'user1',
          prompt: {
            start: 'quem você quer shipar?'
          }
        },
        {
          type: 'user',
          id: 'user2',
          prompt: {
            start: 'com quem você quer shipar?'
          }
        }
      ]
    });
  }

  async exec (msg: Message, args: ArgsI) {
    const { buffer, shipName} = await ship2(args.user1, args.user2)
    const attch = new Attachment(buffer, 'ship.png')
    return msg.reply(shipName, attch);
  }
}

export default ShipCommand;
