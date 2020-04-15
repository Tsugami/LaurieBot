import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message, PresenceStatusData, Guild } from 'discord.js';
import { getDate } from '@utils/date';

export default class Serverinfo extends LaurieCommand {
  constructor() {
    super('serverinfo', {
      category: 'discord',
      lock: 'guild',
      editable: false,
    });
  }

  async exec(msg: Message) {
    const { author } = msg;
    const guild = msg.guild as Guild;

    function getMemberSizeByStatus(status: PresenceStatusData) {
      return guild.members.cache.filter(m => m.user.presence.status === status).size;
    }

    const embed = new LaurieEmbed(author)
      .addInfoText(
        'FOLDER',
        msg.t('commands:serverinfo.server_info'),
        ['COMPUTER', msg.t('commons:id'), guild.id],
        ['COMPUTER', msg.t('commons:name'), guild.name],
        ['CROWN', msg.t('commands:serverinfo.owner'), guild.owner?.user.tag ?? guild.ownerID],
        ['EARTH', msg.t('commands:serverinfo.region'), guild.region],
        ['CALENDER', msg.t('commons:created_on'), getDate(guild.createdAt)],
        ['INBOX', msg.t('commons:joined_on'), getDate(guild.joinedAt)],
      )
      .addInfoText(
        'PERSON',
        msg.t('commands:serverinfo.members_info'),
        ['PERSONS', msg.t('commands:serverinfo.members'), guild.members.cache.size],
        ['ROBOT', msg.t('commands:serverinfo.bots'), guild.members.cache.filter(m => m.user.bot).size],
        ['STATUS_ONLINE', msg.t('commons:status.online'), getMemberSizeByStatus('online')],
        ['STATUS_OFFLINE', msg.t('commons:status.offline'), getMemberSizeByStatus('invisible')],
        ['STATUS_BUSY', msg.t('commons:status.dnd'), getMemberSizeByStatus('dnd')],
        ['STATUS_AWAY', msg.t('commons:status.idle'), getMemberSizeByStatus('idle')],
      );
    const icon = guild.iconURL({ size: 2048 });
    if (icon) embed.setThumbnail(icon);
    msg.reply(embed);
  }
}
