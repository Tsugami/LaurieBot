import { Listener, Command } from 'discord-akairo';
import { Message, GuildMember, TextChannel } from 'discord.js';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { Emojis } from '@utils/Constants';
import { getDate } from '@utils/Date';
import { guild } from '@database/index';
import { getFixedT } from '@struct/Command';

export default class PunishmentCommandListener extends Listener {
  constructor() {
    super('punishmentCommand', {
      emitter: 'client',
      eventName: 'punishmentCommand',
    });
  }

  async exec(msg: Message, command: Command, member: GuildMember, reason: string) {
    const guildData = await guild(msg.guild.id);
    if (guildData) {
      const channels = guildData.data.penaltyChannels;
      const t = getFixedT(msg);

      channels.forEach(channelId => {
        const channel = msg.guild.channels.get(channelId);

        if (channel instanceof TextChannel) {
          const text = new Text()
            .addTitle(Emojis.BALLOT_BOX, t('modules:punishment.punishment_info'))
            .addField(Emojis.PAGE, t('modules:punishment.type'), command.id)
            .addField(Emojis.MAN_JUDGE, t('modules:punishment.judge'), msg.author.toString())
            .addField(Emojis.SCALES, t('modules:punishment.reason'), reason)
            .addField(Emojis.CAP, t('modules:punishment.user'), member.toString())
            .addField(Emojis.SPEECH_BALLON, t('modules:punishment.text_channel'), msg.channel.toString())
            .skip()
            .addTitle(Emojis.CARD_INDEX, t('modules:punishment.user_info'))
            .addField(Emojis.PERSON, t('commons:name'), member.user.tag)
            .addField(Emojis.COMPUTER, t('commons:id'), member.user.id)
            .addField(Emojis.CALENDER, t('commons:joined_on'), getDate(member.joinedAt));

          const embed = new Embed(msg.author).setDescription(text).setThumbnail(member.user.displayAvatarURL);

          channel.send(embed);
        }
      });
    }
  }
}
