import { Message, TextChannel, GuildMember } from 'discord.js';
import Command, { getFixedT } from '@struct/Command';
import { guild } from '@database/index';

import LaurieEmbed from '@struct/LaurieEmbed';
import { getDate } from '@utils/Date';

export async function sendPunaltyMessage(message: Message, member: GuildMember, command: Command, reason: string) {
  const guildData = await guild(message.guild.id);
  const channelId = guildData.data.penaltyChannel;
  const channel = message.guild.channels.get(String(channelId));

  if (channel instanceof TextChannel) {
    const t = getFixedT(message);

    const embed = new LaurieEmbed(message.author)
      .setThumbnail(member.user.displayAvatarURL)
      .addInfoText(
        'BALLOT_BOX',
        t('modules:punishment.punishment_info'),
        ['PAGE', t('modules:punishment.type'), command.id],
        ['MAN_JUDGE', t('modules:punishment.judge'), message.author.toString()],
        ['SCALES', t('modules:punishment.reason'), reason],
        ['CAP', t('modules:punishment.user'), member.toString()],
        ['SPEECH_BALLON', t('modules:punishment.text_channel'), message.channel.toString()],
      )
      .addInfoText(
        'CARD_INDEX',
        t('modules:punishment.user_info'),
        ['PERSON', t('commons:name'), member.user.tag],
        ['COMPUTER', t('commons:id'), member.user.id],
        ['CALENDER', t('commons:joined_on'), getDate(member.joinedAt)],
      );

    channel.send(embed);
  }
}

export function parseWelcomeMessage(text: string, user: string, guildName: string) {
  return text.replace(/{{user}}/gi, user).replace(/{{guild}}/gi, guildName);
}

export async function sendWelcomeMessage(member: GuildMember) {
  const { data } = await guild(member.guild.id);

  const channel = member.guild.channels.get(String(data?.welcome?.channelId));
  if (channel instanceof TextChannel) {
    const message = parseWelcomeMessage(
      data?.welcome?.message || getFixedT(member.guild)('modules:welcome.message_default'),
      member.toString(),
      guild.toString(),
    );

    channel.send(parseWelcomeMessage(message, member.user.toString(), member.guild.name));
  }
}

export async function deleteWordBannedMessage(message: Message) {
  if (message.author.bot) return;
  const { wordFilter } = await guild(message.guild.id);

  if (wordFilter.get().some(word => message.content.toLowerCase().includes(word))) {
    message.delete();
    message.reply(
      getFixedT(message)('modules:filter.message_default', { command: `\`${process.env.BOT_PREFIX}listfiltro\`` }),
    );
  }
}
