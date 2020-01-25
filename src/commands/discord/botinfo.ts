import { Command } from 'discord-akairo';
import { Message, Client } from 'discord.js';

import { Discord } from '../../categories';
import Embed from '../../utils/Embed';
import Text from '../../utils/Text';
import { getDate } from '../../utils/Date';
import { Emojis } from '../../utils/Constants';

async function getUser(userId: string, client: Client): Promise<string> {
  const findByUsers = client.users.get(userId)
  if (findByUsers) return findByUsers.tag
  const findByGlobal = await client.fetchUser(userId).catch(() => null)
  if (findByGlobal) return findByGlobal.tag
  return userId
}

class BotinfoCommand extends Command {
  constructor() {
    super('botinfo', {
      aliases: ['botinfo', 'infobot'],
      category: Discord
    });
  }

  async exec (msg: Message) {
    const bot = msg.client
    const dev = process.env.DEV_ID ? await getUser(process.env.DEV_ID, bot) : 'Desconhecido'
    const owner = process.env.CREATOR_ID ? await getUser(process.env.CREATOR_ID, bot) : 'Desconhecido'
    const text = new Text()
      .addTitle(Emojis.ROBOT, 'INFORMAÇÕES DO BOT')
      .addField(Emojis.LABEL, 'Nome', bot.user.username)
      .addField(Emojis.SHIELD, 'Servidores', bot.guilds.size)
      .addField(Emojis.CALENDER, 'Criado em', getDate(bot.user.createdAt))
      .addField(Emojis.CROWN, 'Criador', owner)
      .addField(Emojis.KEYBOARD, 'Desenvolvedor', dev)
    const embed = new Embed(msg.author)
      .setDescription(text)
      .setThumbnail(bot.user.displayAvatarURL)
    msg.reply(embed);
  }
}

export default BotinfoCommand;
