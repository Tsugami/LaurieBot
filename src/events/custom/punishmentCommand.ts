import { Listener, Command } from 'discord-akairo';
import { Message, GuildMember, TextChannel } from 'discord.js';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { Emojis } from '@utils/Constants';
import { getDate } from '@utils/Date';
import { guild } from '@database/index';

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

      for (const channelId of channels) {
        const channel = msg.guild.channels.get(channelId);

        if (channel instanceof TextChannel) {
          const text = new Text()
            .addTitle(Emojis.BALLOT_BOX, 'INFORMAÇÕES DE PUNIÇÃO')
            .addField(Emojis.PAGE, 'Pena', command.id)
            .addField(Emojis.MAN_JUDGE, 'Juiz', msg.author.toString())
            .addField(Emojis.SCALES, 'Motivo', reason)
            .addField(Emojis.CAP, 'Culpado', member.toString())
            .addField(Emojis.SPEECH_BALLON, 'Canal', msg.channel.toString())
            .skip()
            .addTitle(Emojis.CARD_INDEX, 'INFORMAÇÕES DO USUÁRIO')
            .addField(Emojis.PERSON, 'Nome', member.user.tag)
            .addField(Emojis.COMPUTER, 'Id', member.user.id)
            .addField(Emojis.CALENDER, 'Entrou em', getDate(member.joinedAt));

          const embed = new Embed(msg.author).setDescription(text).setThumbnail(member.user.displayAvatarURL);

          channel.send(embed);
        }
      }
    }
  }
}
