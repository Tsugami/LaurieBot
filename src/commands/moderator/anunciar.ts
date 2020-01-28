import Command, { TFunction, Prompt } from '@struct/Command';

import { Message } from 'discord.js';
import Embed from '@utils/Embed';
import { Emojis } from '@utils/Constants';

interface ArgsI {
  text: string;
}

class AnunciarCommand extends Command {
  constructor() {
    super('anunciar', {
      aliases: ['anunciar'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: Prompt('commands:anunciar.args.text.start'),
            retry: Prompt('commands:anunciar.args.text.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const title = t('commands:anunciar.embed_title', { emoji: Emojis.ANUNCIAR });
    return msg.channel.send(new Embed(msg.author).setAuthor(title).setDescription(args.text));
  }
}

export default AnunciarCommand;
