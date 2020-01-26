import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Moderator } from '@categories';
import Embed from '@utils/Embed';
import { Emojis } from '@utils/Constants';


interface ArgsI {
  text: string
}

class AnunciarCommand extends Command {
  constructor() {
    super('anunciar', {
      aliases: ['anunciar'],
      category: Moderator,
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: 'uma mensagem você quer anunciar?',
            retry: 'mensagem invalida.'
          }
        }
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    return msg.channel.send(new Embed(msg.author).setAuthor(`${Emojis.ANUNCIAR} ANÚNCIO`).setDescription(args.text))
  }
}

export default AnunciarCommand;
