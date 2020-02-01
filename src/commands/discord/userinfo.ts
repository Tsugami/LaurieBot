import Command, { TFunction } from '@struct/Command';
import { Message, GuildMember } from 'discord.js';

import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { Emojis, STATUS_EMOJIS, CUSTOM_STATUS } from '@utils/Constants';
import { getDate } from '@utils/Date';

class UserinfoCommand extends Command {
  constructor() {
    super('userinfo', {
      aliases: ['userinfo'],
      category: 'discord',
      channelRestriction: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          default: (msg: Message) => msg.member,
        },
      ],
    });
  }

  run(msg: Message, t: TFunction, { member }: { member: GuildMember }) {
    const { author, guild } = msg;
    const { user, presence } = member;
    const text = new Text();

    const status = t(`commons:status:${presence.status}`);
    const statusEmoji = STATUS_EMOJIS[presence.status];

    const roles = member.roles
      .filter(role => role.id !== guild.id)
      .map(role => role.toString())
      .slice(0, 5);

    const roleMessage = roles.length > 0 ? roles.join(', ') : t('commons:none');

    text.addTitle(Emojis.WALLET, t('commands:userinfo.user_info', { username: user.username.toLowerCase() }));
    text.addField(Emojis.PERSON, t('commons:name'), user.tag);
    text.addField(Emojis.COMPUTER, t('commons:id'), user.id);
    text.addField(statusEmoji, t('commons:status_e'), status);
    text.addField(Emojis.CALENDER, t('commons:created_on'), getDate(user.createdAt));
    text.addField(Emojis.INBOX, t('commons:joined_on'), getDate(member.joinedAt));
    text.addField(Emojis.BRIEFCASE, t('commons:roles'), roleMessage);

    const embed = new Embed(author)
      .setAuthor(user.username, user.displayAvatarURL)
      .setDescription(text)
      .setThumbnail(user.displayAvatarURL);
    msg.reply(embed);
  }
}

export default UserinfoCommand;
