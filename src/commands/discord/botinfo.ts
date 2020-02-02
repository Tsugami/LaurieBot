import Command, { TFunction } from '@struct/Command';
import { Message, Client } from 'discord.js';

import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { getDate } from '@utils/Date';
import { Emojis } from '@utils/Constants';

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
      aliases: ['botinfo', 'infobot'],
      category: 'discord',
      help: 'infobot',
    });
  }

  async run(msg: Message, t: TFunction) {
    const unknownTranst = t('commons:unknown');
    const bot = msg.client;
    const dev = process.env.DEV_ID ? await getUser(process.env.DEV_ID, bot) : unknownTranst;
    const owner = process.env.CREATOR_ID ? await getUser(process.env.CREATOR_ID, bot) : unknownTranst;
    const text = new Text()
      .addTitle(Emojis.ROBOT, t('commands:botinfo.bot_info'))
      .addField(Emojis.LABEL, t('commons:name'), bot.user.username)
      .addField(Emojis.SHIELD, t('commands:botinfo.guilds'), bot.guilds.size)
      .addField(Emojis.CALENDER, t('commons:created_on'), getDate(bot.user.createdAt))
      .addField(Emojis.CROWN, t('commands:botinfo.creator'), owner)
      .addField(Emojis.KEYBOARD, t('commands:botinfo.developer'), dev);
    const embed = new Embed(msg.author).setDescription(text).setThumbnail(bot.user.displayAvatarURL);
    msg.reply(embed);
  }
}

export default BotinfoCommand;
