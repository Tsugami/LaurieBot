import Command, { TFunction } from '@struct/Command';
import { Message, Client } from 'discord.js';

import LaurieEmbed from '@struct/LaurieEmbed';
import { getDate } from '@utils/Date';

async function getUser(userId: string, client: Client): Promise<string> {
  const findByUsers = client.users.get(userId);
  if (findByUsers) return findByUsers.tag;
  const findByGlobal = await client.fetchUser(userId).catch(() => null);
  if (findByGlobal) return findByGlobal.tag;
  return userId;
}

class BotinfoCommand extends Command {
  constructor() {
    super('botinfo', {
      aliases: ['infobot'],
      category: 'discord',
    });
  }

  async run(msg: Message, t: TFunction) {
    const unknownTranst = t('commons:unknown');
    const bot = msg.client;
    const dev = process.env.DEV_ID ? await getUser(process.env.DEV_ID, bot) : unknownTranst;
    const owner = process.env.CREATOR_ID ? await getUser(process.env.CREATOR_ID, bot) : unknownTranst;
    const embed = new LaurieEmbed(msg.author)
      .setThumbnail(bot.user.displayAvatarURL)
      .addInfoText(
        'ROBOT',
        t('commands:botinfo.bot_info'),
        ['LABEL', t('commons:name'), bot.user.username],
        ['SHIELD', t('commands:botinfo.guilds'), bot.guilds.size],
        ['CALENDER', t('commons:created_on'), getDate(bot.user.createdAt)],
        ['CROWN', t('commands:botinfo.creator'), owner],
        ['KEYBOARD', t('commands:botinfo.developer'), dev],
      );

    msg.reply(embed);
  }
}

export default BotinfoCommand;
