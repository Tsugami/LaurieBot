import { Message, User } from 'discord.js';

import Embed from '@utils/Embed';

import Command, { TFunction } from '@struct/Command';

interface ArgsI {
  user: User;
}

class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: 'discord',
      args: [
        {
          id: 'user',
          type: 'user',
          default: (msg: Message) => msg.author,
        },
      ],
    });
  }

  run(msg: Message, t: TFunction, args: ArgsI) {
    const { user } = args;

    const embed = new Embed(msg.author)
      .setAuthor(`📸 ${user.username}`)
      .setDescription(t('commands:avatar.embed_description', { avatarUrl: user.displayAvatarURL }))
      .setImage(user.displayAvatarURL);
    msg.reply(embed);
  }
}

export default AvatarCommand;
