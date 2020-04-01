import Command, { TFunction } from '@struct/Command';
import { Message, PresenceStatusData } from 'discord.js';

import LaurieEmbed from '@struct/LaurieEmbed';
import getCountryInPortuguese from '@utils/getCountryInPortuguese';
import { getDate } from '@utils/Date';

class ServerinfoCommand extends Command {
  constructor() {
    super('serverinfo', {
      category: 'discord',
      channelRestriction: 'guild',
    });
  }

  run(msg: Message, t: TFunction) {
    const { guild, author } = msg;

    function getMemberSizeByStatus(status: PresenceStatusData) {
      return guild.members.filter(m => m.user.presence.status === status).size;
    }

    const embed = new LaurieEmbed(author)
      .addInfoText(
        'FOLDER',
        t('commands:serverinfo.server_info'),
        ['COMPUTER', t('commons:id'), guild.id],
        ['COMPUTER', t('commons:name'), guild.name],
        ['CROWN', t('commands:serverinfo.owner'), guild.owner.user.username],
        ['EARTH', t('commands:serverinfo.region'), getCountryInPortuguese(guild.region)],
        ['CALENDER', t('commons:created_on'), getDate(guild.createdAt)],
        ['INBOX', t('commons:joined_on'), getDate(guild.joinedAt)],
      )
      .addInfoText(
        'PERSON',
        t('commands:serverinfo.members_info'),
        ['PERSONS', t('commands:serverinfo.members'), guild.members.size],
        ['ROBOT', t('commands:serverinfo.bots'), guild.members.filter(m => m.user.bot).size],
        ['STATUS_ONLINE', t('commons:status.online'), getMemberSizeByStatus('online')],
        ['STATUS_OFFLINE', t('commons:status.offline'), getMemberSizeByStatus('offline')],
        ['STATUS_BUSY', t('commons:status.dnd'), getMemberSizeByStatus('dnd')],
        ['STATUS_AWAY', t('commons:status.idle'), getMemberSizeByStatus('idle')],
      );
    if (guild.iconURL) embed.setThumbnail(`${guild.iconURL}?size=2048`);
    msg.reply(embed);
  }
}

export default ServerinfoCommand;
