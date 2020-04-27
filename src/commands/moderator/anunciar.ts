import Command from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { EMOJIS } from '@utils/constants';
import { Message } from 'discord.js';

export default class Anunciar extends Command {
  constructor() {
    super('anunciar', {
      editable: true,
      category: 'moderator',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: (m: Message) => m.t('commands:anunciar.args.text.start'),
            retry: (m: Message) => m.t('commands:anunciar.args.text.retry'),
          },
        },
      ],
    });
  }

  exec(msg: Message, { text }: { text: string }) {
    const title = msg.t('commands:anunciar.embed_title', { emoji: EMOJIS.ANUNCIAR });
    return msg.util?.send(new LaurieEmbed(msg.author).setTitle(title).setDescription(text));
  }
}
