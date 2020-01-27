import { Command } from 'discord-akairo';
import { Message, User, PresenceStatusData } from 'discord.js';

import { Discord } from '@categories';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import getCountryInPortuguese from '@utils/getCountryInPortuguese';
import { Emojis } from '@utils/Constants';
import { getDate } from '@utils/Date';

class ServerinfoCommand extends Command {
  constructor() {
    super('serverinfo', {
      aliases: ['serverinfo'],
      category: Discord,
      channelRestriction: 'guild',
    });
  }

  exec(msg: Message) {
    const { guild, author } = msg;

    const text = new Text();

    function getMemberSizeByStatus(status: PresenceStatusData) {
      return guild.members.filter(m => m.user.presence.status === status).size;
    }

    text.addTitle(Emojis.FOLDER, 'INFORMAÇÕES DO SERVIDOR');
    text.addField(Emojis.COMPUTER, 'ID', guild.id);
    text.addField(Emojis.CROWN, 'Dono', guild.owner.user.username);
    text.addField(Emojis.EARTH, 'Região', getCountryInPortuguese(guild.region));
    text.addField(Emojis.CALENDER, 'Criado em', getDate(guild.createdAt));
    text.addField(Emojis.INBOX, 'Entrei em', getDate(guild.joinedAt));
    text.skip();
    text.addTitle(Emojis.PERSON, 'INFORMAÇÕES DOS MEMBROS');
    text.addField(Emojis.PERSONS, 'Membros', guild.members.size);
    text.addField(Emojis.ROBOT, 'Robôs', guild.members.filter(m => m.user.bot).size);
    text.addField(Emojis.STATUS_ONLINE, 'Online', getMemberSizeByStatus('online'));
    text.addField(Emojis.STATUS_OFFLINE, 'Offline', getMemberSizeByStatus('offline'));
    text.addField(Emojis.STATUS_BUSY, 'Ocupado', getMemberSizeByStatus('dnd'));
    text.addField(Emojis.STATUS_AWAY, 'Ausente', getMemberSizeByStatus('idle'));

    const embed = new Embed(author).setAuthor(guild.name, guild.iconURL).setDescription(text);
    if (guild.iconURL) embed.setThumbnail(`${guild.iconURL}?size=2048`);
    msg.reply(embed);
  }
}

export default ServerinfoCommand;
