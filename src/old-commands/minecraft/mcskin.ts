import Command from '@struct/command/Command';
import LaurieEmbed from '@struct/LaurieEmbed';
import { getUser } from '@services/minecraft';

export default new Command(
  'mcskin',
  {
    category: 'minecraft',
    args: [
      {
        id: 'username',
        type: 'string',
      },
    ],
  },
  async (msg, t, { username }) => {
    let res;
    try {
      res = await getUser(username);
    } catch (_) {
      return msg.reply(t('commands:mcskin.not_found'));
    }

    const embed = new LaurieEmbed(msg.author).setAuthor(res.name).setImage(res.skin);
    msg.reply(embed);
  },
);
