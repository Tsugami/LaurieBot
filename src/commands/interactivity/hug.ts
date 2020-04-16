import Neeko from '@services/neko';
import LaurieCommand from '@structures/LaurieCommand';
import { Message, User } from 'discord.js';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class Hug extends LaurieCommand {
  constructor() {
    super('hug', {
      aliases: ['abraçar'],
      category: 'interactivity',
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            start: (m: Message) => m.t('commands:hug.args.user.start'),
            retry: (m: Message) => m.t('commands:hug.args.user.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { user }: { user: User }) {
    const { url } = await Neeko.sfw.hug();

    const embed = new LaurieEmbed(
      msg.author,
      msg.t(`commands:hug.message`, { author: msg.author.username, user: user.username }),
    ).setImage(url);
    msg.reply(embed);
  }
}
