import LaurieEmbed from '@structures/LaurieEmbed';
import LaurieCommand from '@structures/LaurieCommand';
import { getDate } from '@utils/date';
import { Message, ClientUser } from 'discord.js';

export default class Botinfo extends LaurieCommand {
  constructor() {
    super('botinfo', {
      aliases: ['infobot'],
      category: 'discord',
      editable: true,
    });
  }

  async exec(msg: Message) {
    const findUser = async (userId?: string) => {
      if (!userId) return msg.t('commons:unknown');
      return this.client.users.cache.get(userId)?.tag ?? (await this.client.users.fetch(userId, false))?.tag ?? userId;
    };

    const owner = await findUser(process.env.OWNER_ID);
    const dev = await findUser(process.env.DEV_ID);
    const invite = await this.client.generateInvite();

    const botUser = this.client.user as ClientUser;

    const embed = new LaurieEmbed(msg.author)
      .setThumbnail(botUser.displayAvatarURL())
      .addInfoText(
        'ROBOT',
        msg.t('commands:botinfo.bot_info'),
        ['LABEL', msg.t('commons:name'), botUser.username],
        ['SHIELD', msg.t('commands:botinfo.guilds'), this.client.guilds.cache.size],
        ['GIFT_HEART', msg.t('commands:botinfo.users'), this.client.users.cache.size],
        ['CALENDER', msg.t('commons:created_on'), getDate(botUser.createdAt)],
        ['CROWN', msg.t('commands:botinfo.creator'), owner],
        ['KEYBOARD', msg.t('commands:botinfo.developer'), dev],
      );

    embed.description += `\n${msg.t('commons:me_add_your_server', { invite })}`;
    msg.util?.reply(embed);
  }
}
