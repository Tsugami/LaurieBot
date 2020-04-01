import Command, { TFunction } from '@struct/Command';

import { Message } from 'discord.js';
import LaurieEmbed from '@struct/LaurieEmbed';
import { getUser } from '@services/minecraft';

interface ArgsI {
  username: string;
}

class McSkinCommand extends Command {
  constructor() {
    super('mcskin', {
      category: 'minecraft',
      args: [
        {
          id: 'username',
          type: 'string',
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    let res;
    try {
      res = await getUser(args.username);
    } catch (_) {
      return msg.reply(t('commands:mcskin.not_found'));
    }

    const embed = new LaurieEmbed(msg.author).setAuthor(res.name).setImage(res.skin);
    msg.reply(embed);
  }
}

export default McSkinCommand;
