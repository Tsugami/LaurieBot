import { Message } from 'discord.js';
import GifSearch from '@services/giphy';
import { Emojis } from '@utils/Constants';
import Command, { TFunction } from '@struct/Command';

interface ArgsI {
  query: string;
}

class GifCommand extends Command {
  constructor() {
    super('gif', {
      aliases: ['gif'],
      category: 'discord',
      help: 'gif',
      args: [
        {
          id: 'query',
          type: 'string',
          default: '',
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    let res;
    let sent: Message | Message[];

    function deleteMsg() {
      if (sent instanceof Array) {
        return sent.forEach(x => x.delete());
      }
      return sent.delete();
    }

    try {
      sent = await msg.reply(t('commands:gif.searching', { emoji: Emojis.COMPUTER }));
      res = await GifSearch.random(args.query);
    } catch (error) {
      console.error('Falha ao procurar uma gif', error);
      await deleteMsg();
      msg.reply(t('commands:gif.failed_to_fetch'));
    }

    if (res) {
      await msg.reply(res.data.images.original.url);

      await deleteMsg();
    } else {
      await deleteMsg();
      msg.reply(t('commands:gif:not_found'));
    }
  }
}

export default GifCommand;
