import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import GifSearch from '@services/giphy';
import { Discord } from '@categories';
import { Emojis } from '@utils/Constants';

interface ArgsI {
    query: string
}

class GifCommand extends Command {
  constructor() {
    super('gif', {
      aliases: ['gif'],
      category: Discord,
      args: [
        {
          id: 'query',
          type: 'string',
          default: ''
        },
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    let res
    let sent: Message | Message[]

    function deleteMsg() {
     if (sent instanceof Array) {
       return sent.forEach(x => x.delete())
     } else {
       return sent.delete()
     }
    }

    try {
      sent = await msg.reply(`Estou procurando... ${Emojis.COMPUTER}`)
      res = await GifSearch.random(args.query)
    } catch (error) {
      console.log(error)
      await deleteMsg()
      msg.reply(`não possivel procurar um gif.`)
    }

    if (res) {
      await msg.reply(res.data.images.original.url)

      await deleteMsg()
    } else {
      await deleteMsg()
      msg.reply('não achei nenhum gif com essa palavra.')
    }
  }
}

export default GifCommand;
