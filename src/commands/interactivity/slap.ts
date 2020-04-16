import Neeko from '@services/neko';
import LaurieCommand from '@structures/LaurieCommand';
import { Message, User } from 'discord.js';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class Slap extends LaurieCommand {
  constructor() {
    super('slap', {
      aliases: ['bater'],
      category: 'interactivity',
      editable: true,
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            start: (m: Message) => m.t('commands:slap.args.user.start'),
            retry: (m: Message) => m.t('commands:slap.args.user.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { user }: { user: User }) {
    const { url } = await Neeko.sfw.slap();

    const embed = new LaurieEmbed(
      msg.author,
      msg.t(`commands:slap.message`, { author: msg.author.username, user: user.username }),
    ).setImage(url);
    msg.reply(embed);
  }
}
