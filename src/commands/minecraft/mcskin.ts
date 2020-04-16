import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';

import { getUser } from '@services/minecraft';

export default class McSkin extends LaurieCommand {
  constructor() {
    super('mcskin', {
      editable: true,
      category: 'minecraft',
      args: [
        {
          id: 'username',
          prompt: {
            start: (m: Message) => m.t('commands:mcskin.args.username.start'),
            retry: (m: Message) => m.t('commands:mcskin.args.username.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { username }: { username: string }) {
    let res;
    try {
      res = await getUser(username);
      const embed = new LaurieEmbed(msg.author).setAuthor(res.name).setImage(res.skin);
      msg.util?.reply(embed);
    } catch (error) {
      this.logger.error(error);
      return msg.util?.reply(msg.t('commands:mcskin.not_found'));
    }
  }
}
