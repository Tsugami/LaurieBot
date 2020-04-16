import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';

import { getServer } from '@services/minecraft';

export default class Mcserver extends LaurieCommand {
  constructor() {
    super('mcserver', {
      editable: true,
      category: 'minecraft',
      args: [
        {
          id: 'server',
          prompt: {
            start: (m: Message) => m.t('commands:mcserver.args.server.start'),
            retry: (m: Message) => m.t('commands:mcserver.args.server.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { server }: { server: string }) {
    try {
      const res = await getServer(server);
      const embed = new LaurieEmbed(msg.author).addInfoText(
        'PLACA_MINECRAFT',
        msg.t('commands:mcserver.server_info'),
        ['COMPUTER', msg.t('commands:mcserver.address'), res.address],
        ['PERSONS', msg.t('commands:mcserver.players'), res.players],
        ['JAVA', msg.t('commands:mcserver.minecraft_version'), res.version],
      );
      msg.util?.reply(embed);
    } catch (error) {
      this.logger.error(error);
      return msg.util?.reply(msg.t('commands:mcserver.not_found'));
    }
  }
}
