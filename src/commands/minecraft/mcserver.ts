import Command, { TFunction } from '@struct/Command';

import { Message } from 'discord.js';
import LaurieEmbed from '@struct/LaurieEmbed';
import { getServer } from '@services/minecraft';

interface ArgsI {
  server: string;
}

class McServerCommand extends Command {
  constructor() {
    super('mcserver', {
      aliases: ['mcserver'],
      category: 'minecraft',
      help: 'mcserver',
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
      this.printError(error, msg);
      return msg.reply(t('commands:mcserver.not_found'));
    }

    const embed = new LaurieEmbed(msg.author).addInfoText(
      'PLACA_MINECRAFT',
      t('commands:mcserver.server_info'),
      ['COMPUTER', t('commands:mcserver.address'), res.address],
      ['PERSONS', t('commands:mcserver.players'), res.players],
      ['JAVA', t('commands:mcserver.minecraft_version'), res.version],
    );
    msg.reply(embed);
  }
}

export default McServerCommand;
