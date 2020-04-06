import Command from '@struct/command/Command';
import LaurieEmbed from '@struct/LaurieEmbed';
import { EMOJIS } from '@utils/Constants';

export default new Command(
  'anunciar',
  {
    category: 'moderator',
    channelRestriction: 'guild',
    userPermissions: 'MANAGE_MESSAGES',
    args: [
      {
        id: 'text',
        type: 'string',
        match: 'text',
      },
    ],
  },
  async (msg, t, { text }) => {
    const title = t('commands:anunciar.embed_title', { emoji: EMOJIS.ANUNCIAR });
    return msg.channel.send(new LaurieEmbed(msg.author).setTitle(title).setDescription(text));
  },
);
