import { Message } from 'discord.js';
import GifSearch from '@services/giphy';
import { EMOJIS } from '@utils/Constants';
import Command from '@struct/command/Command';
import { printError } from '@utils/Utils';

export default new Command(
  'gif',
  {
    category: 'interactivity',
    args: [
      {
        id: 'query',
        type: 'string',
      },
    ],
  },
  async function run(msg, t, args) {
    let res;
    let sent: Message | Message[];

    function deleteMsg() {
      if (sent instanceof Array) {
        return sent.forEach(x => x.delete());
      }
      return sent.delete();
    }

    try {
      sent = await msg.reply(t('commands:gif.searching', { emoji: EMOJIS.COMPUTER }));
      res = await GifSearch.random(args.query);
    } catch (error) {
      printError(error, this);
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
  },
);
