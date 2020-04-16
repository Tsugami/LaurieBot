import Neeko from '@services/neko';
import LaurieCommand from '@structures/LaurieCommand';
import { Message, User } from 'discord.js';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class Kiss extends LaurieCommand {
  constructor() {
    super('kiss', {
      aliases: ['beijar'],
      category: 'interactivity',
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            start: (m: Message) => m.t('commands:kiss.args.user.start'),
            retry: (m: Message) => m.t('commands:kiss.args.user.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { user }: { user: User }) {
    const { url } = await Neeko.sfw.kiss();

    const embed = new LaurieEmbed(
      msg.author,
      msg.t(`commands:kiss.message`, { author: msg.author.username, user: user.username }),
    ).setImage(url);
    msg.reply(embed);
  }
}
