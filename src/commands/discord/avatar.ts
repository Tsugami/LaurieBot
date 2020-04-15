import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message, User } from 'discord.js';

export default class Avatar extends LaurieCommand {
  constructor() {
    super('avatar', {
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

  exec(msg: Message, { user }: { user: User }) {
    const avatar = user.displayAvatarURL({ size: 2048 });
    const embed = new LaurieEmbed(msg.author)
      .setAuthor(`📸 ${user.username}`)
      .setDescription(msg.t('commands:avatar.embed_description', { avatarUrl: avatar }))
      .setImage(avatar);
    msg.util?.reply(embed);
  }
}
