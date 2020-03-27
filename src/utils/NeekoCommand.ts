import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, User } from 'discord.js';

import Embed from './Embed';

type urlFuncT = () => Promise<string>;

class NeekoCommand extends Command {
  private text: string;

  private urlFunc: urlFuncT;

  constructor(commandName: string, aliases: string[], text: string, urlFunc: urlFuncT, help: string) {
    super(commandName, {
      aliases: [commandName, ...aliases],
      category: 'interactivity',
      help,
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            start: Prompt((t, m) => `${m.author.toString()}, ${t(`commands:${commandName}.args.user.start`)}`),
            retry: Prompt(`commands:${commandName}.args.user.retry`),
          },
        },
      ],
    });
    this.text = text;
    this.urlFunc = urlFunc;
  }

  async run(msg: Message, t: TFunction, { user }: { user: User }) {
    const url = await this.urlFunc();
    const embed = new Embed(msg.author).setDescription(t(this.text, { user1: msg.author, user2: user })).setImage(url);
    msg.reply(embed);
  }
}

export default NeekoCommand;
