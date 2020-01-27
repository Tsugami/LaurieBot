import { Command } from 'discord-akairo';
import { Message, Attachment } from 'discord.js';
import { Minecraft } from '@categories';
import { getAwardImage } from '@services/minecraft';

interface ArgsI {
  text: string;
}

class McConquistaCommand extends Command {
  constructor() {
    super('mcconquista', {
      aliases: ['mcconquista'],
      category: Minecraft,
      args: [
        {
          id: 'text',
          type: 'string',
        },
      ],
    });
  }

  async exec(msg: Message, args: ArgsI) {
    const image = getAwardImage('Conquista desbloqueada!', args.text);
    msg.reply(new Attachment(image, 'image.png'));
  }
}

export default McConquistaCommand;
