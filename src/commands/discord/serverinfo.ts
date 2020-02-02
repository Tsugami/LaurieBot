import Command, { TFunction } from '@struct/Command';
import { Message, PresenceStatusData } from 'discord.js';

import Embed from '@utils/Embed';
import Text from '@utils/Text';
import getCountryInPortuguese from '@utils/getCountryInPortuguese';
import { Emojis } from '@utils/Constants';
import { getDate } from '@utils/Date';

class ServerinfoCommand extends Command {
  constructor() {
    super('serverinfo', {
      aliases: ['serverinfo'],
      category: 'discord',
      help: 'serverinfo',
      channelRestriction: 'guild',
    });
  }

  run(msg: Message, t: TFunction) {
    const { guild, author } = msg;

    const text = new Text();

    function getMemberSizeByStatus(status: PresenceStatusData) {
      return guild.members.filter(m => m.user.presence.status === status).size;
    }

    text.addTitle(Emojis.FOLDER, t('commands:serverinfo.server_info'));
    text.addField(Emojis.COMPUTER, t('commons:id'), guild.id);
    text.addField(Emojis.COMPUTER, t('commons:name'), guild.name);
    text.addField(Emojis.CROWN, t('commands:serverinfo.owner'), guild.owner.user.username);
    text.addField(Emojis.EARTH, t('commands:serverinfo.region'), getCountryInPortuguese(guild.region));
    text.addField(Emojis.CALENDER, t('commons:created_on'), getDate(guild.createdAt));
    text.addField(Emojis.INBOX, t('commons:joined_on'), getDate(guild.joinedAt));
    text.skip();
    text.addTitle(Emojis.PERSON, t('commands:serverinfo.members_info'));
    text.addField(Emojis.PERSONS, t('commands:serverinfo.members'), guild.members.size);
    text.addField(Emojis.ROBOT, t('commands:serverinfo.bots'), guild.members.filter(m => m.user.bot).size);
    text.addField(Emojis.STATUS_ONLINE, t('commons:status.online'), getMemberSizeByStatus('online'));
    text.addField(Emojis.STATUS_OFFLINE, t('commons:status.offline'), getMemberSizeByStatus('offline'));
    text.addField(Emojis.STATUS_BUSY, t('commons:status.dnd'), getMemberSizeByStatus('dnd'));
    text.addField(Emojis.STATUS_AWAY, t('commons:status.idle'), getMemberSizeByStatus('idle'));

    const embed = new Embed(author).setDescription(text);
    if (guild.iconURL) embed.setThumbnail(`${guild.iconURL}?size=2048`);
    msg.reply(embed);
  }
}

export default ServerinfoCommand;
