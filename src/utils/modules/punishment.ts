import { Message, GuildMember, TextChannel } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
import LaurieEmbed from '@structures/LaurieEmbed';
import { getDate } from '@utils/date';

export default class PunishmentUtil {
  static async sendMessage(msg: Message, member: GuildMember, commandId: string, reason: string) {
    if (!msg.guild) return;

    const guildData = await (msg.client as AkairoClient).database.getGuild(msg.guild.id);
    const channelId = guildData.data.penaltyChannel;
    const channel = msg.guild.channels.cache.get(String(channelId));

    const embed = new LaurieEmbed(msg.author)
      .setThumbnail(member.user.displayAvatarURL())
      .addInfoText(
        'BALLOT_BOX',
        msg.t('modules:punishment.punishment_info'),
        ['PAGE', msg.t('modules:punishment.type'), msg.t(`modules:punishment.types.${commandId}`) as string],
        ['MAN_JUDGE', msg.t('modules:punishment.judge'), msg.author.toString()],
        ['SCALES', msg.t('modules:punishment.reason'), reason],
        ['CAP', msg.t('modules:punishment.user'), member.toString()],
        ['SPEECH_BALLON', msg.t('modules:punishment.text_channel'), msg.channel.toString()],
      )
      .addInfoText(
        'CARD_INDEX',
        msg.t('modules:punishment.user_info'),
        ['PERSON', msg.t('commons:name'), member.user.tag],
        ['COMPUTER', msg.t('commons:id'), member.user.id],
        ['CALENDER', msg.t('commons:joined_on'), getDate(member.joinedAt as Date)],
      );

    (channel as TextChannel).send(embed);
  }
}
