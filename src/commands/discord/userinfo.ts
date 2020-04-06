import Command from '@struct/command/Command';
import { Message } from 'discord.js';

import LaurieEmbed from '@struct/LaurieEmbed';
import { STATUS_EMOJIS } from '@utils/Constants';
import { getDate } from '@utils/Date';

export default new Command(
  'userinfo',
  {
    category: 'discord',
    channelRestriction: 'guild',
    args: [
      {
        id: 'member',
        type: 'member',
        default: (msg: Message) => msg.member,
      },
    ],
  },
  (msg, t, { member }) => {
    const { author, guild } = msg;
    const { user, presence } = member;

    const status = t(`commons:status:${presence.status}`);
    const statusEmoji = STATUS_EMOJIS[presence.status];

    const roles = member.roles
      .array()
      .filter(role => role.id !== guild.id)
      .slice(0, 5)
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString());

    const roleMessage = roles.length > 0 ? roles.join(', ') : t('commons:none');

    const embed = new LaurieEmbed(author)
      .addInfoText(
        'WALLET',
        t('commands:userinfo.user_info', { username: user.username.toLowerCase() }),
        ['PERSON', t('commons:name'), user.tag],
        ['COMPUTER', t('commons:id'), user.id],
        [statusEmoji, t('commons:status_e'), status],
        ['CALENDER', t('commons:created_on'), getDate(user.createdAt)],
        ['INBOX', t('commons:joined_on'), getDate(member.joinedAt)],
        ['BRIEFCASE', t('commons:roles'), roleMessage],
      )
      .setThumbnail(user.displayAvatarURL);
    msg.reply(embed);
  },
);
