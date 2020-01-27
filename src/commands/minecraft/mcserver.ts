import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Minecraft } from '@categories';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { Emojis } from '@utils/Constants';
import { getServer } from '@services/minecraft';

interface ArgsI {
  server: string;
}

class McServerCommand extends Command {
  constructor() {
    super('mcserver', {
      aliases: ['mcserver'],
      category: Minecraft,
      args: [
        {
          id: 'server',
          type: 'string',
        },
      ],
    });
  }

  async exec(msg: Message, args: ArgsI) {
    let res;
    try {
      res = await getServer(args.server);
    } catch (error) {
      console.error('Falha ao procurar server de Minecraft', error);
      return msg.reply('Esse não existe ou não esta online.');
    }

    const text = new Text()
      .addTitle(Emojis.PLACA_MINECRAFT, 'INFORMAÇÕES DO SERVIDOR')
      .addField(Emojis.COMPUTER, 'Address', res.address)
      .addField(Emojis.PERSONS, 'Jogadores', res.players)
      .addField(Emojis.JAVA, 'Versão do Minecraft:', res.version);
    const embed = new Embed(msg.author).setDescription(text);
    msg.reply(embed);
  }
}

export default McServerCommand;
