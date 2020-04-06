import Command from '@struct/command/Command';

import LaurieEmbed from '@struct/LaurieEmbed';
import { getServer } from '@services/minecraft';
import { printError } from '@utils/Utils';

export default new Command(
  'mcserver',
  {
    category: 'minecraft',
    args: [
      {
        id: 'server',
        type: 'string',
      },
    ],
  },
  async function run(msg, t, { server }) {
    let res;
    try {
      res = await getServer(server);
    } catch (error) {
      printError(error, this);
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
  },
);
