import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';

import Embed from './Embed'
import { Interactivity } from '@categories'

type textFuncT = (author: User, user: User) => string
type urlFuncT = () => Promise<string>

class NeekoCommand extends Command {
	private textFunc: textFuncT
	private urlFunc: urlFuncT
  constructor(commandName: string, aliases: string[], textFunc: textFuncT, urlFunc: urlFuncT) {
    super(commandName, {
      aliases: [commandName, ...aliases],
      category: Interactivity,
      args: [{
      	id: 'user',
        type: 'user',
        prompt: {
        	retry: 'Mencione um usuário valido.'
        }
      }]
    });
    this.textFunc = textFunc
    this.urlFunc = urlFunc
  }

  async exec(msg: Message, { user }: { user: User }) {
    const url = await this.urlFunc()
    const embed = new Embed(msg.author)
      .setDescription(this.textFunc(msg.author, user))
      .setImage(url)
    msg.reply(embed);
  }
}

export default NeekoCommand;
