import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { Minecraft } from '../../categories';
import Embed from '../../utils/Embed';
import { getUser } from '../../services/minecraft';


interface ArgsI {
	username: string
}

class McSkinCommand extends Command {
  constructor() {
    super('mcskin', {
      aliases: ['mcskin'],
      category: Minecraft,
      args: [
        {
          id: 'username',
          type: 'string',
        },
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    let res
    try {
      res = await getUser(args.username)
    } catch (_) {
      return msg.reply('Não achei nenhum usuário com esse nome!')
    }

    const embed = new Embed(msg.author)
    	.setAuthor(res.name)
      .setImage(res.skin);
    msg.reply(embed);
  }
}

export default McSkinCommand;
