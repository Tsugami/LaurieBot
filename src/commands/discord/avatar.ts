import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import { discord } from '../../categories';
import Embed from '../../utils/Embed';

class AvatarCommand extends Command {
  constructor() {
    super('avatar', {
      aliases: ['avatar'],
      category: discord,
      args: [
        {
          id: 'user',
          type: 'user',
          default: (msg: Message) => msg.author,
        },
      ],
    });
  }

  exec(msg: Message, args) {
    const { user } = args;

    const embed = new Embed(msg.author)
    	.setAuthor(`📸 ${user.username}`)
    	.setDescription(`Clique [aqui](${user.displayAvatarURL}) para baixar.`)
      .setImage(user.displayAvatarURL);
    msg.reply(embed);
  }
}

export default AvatarCommand;
