import Command, { TFunction } from '@struct/Command';

import { Message } from 'discord.js';
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
      category: 'minecraft',
      args: [
        {
          id: 'server',
          type: 'string',
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    let res;
    try {
      res = await getServer(args.server);
    } catch (error) {
      console.error('Falha ao procurar server de Minecraft', error);
      return msg.reply(t('commands:mcserver.not_found'));
    }

    const text = new Text()
      .addTitle(Emojis.PLACA_MINECRAFT, t('commands:mcserver.server_info'))
      .addField(Emojis.COMPUTER, t('commands:mcserver.address'), res.address)
      .addField(Emojis.PERSONS, t('commands:mcserver.players'), res.players)
      .addField(Emojis.JAVA, t('commands:mcserver.minecraft_version'), res.version);
    const embed = new Embed(msg.author).setDescription(text);
    msg.reply(embed);
  }
}

export default McServerCommand;
