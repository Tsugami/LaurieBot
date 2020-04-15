import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message, GuildMember } from 'discord.js';
import { STATUS_EMOJIS } from '@utils/constants';
import { getDate } from '@utils/date';

export default class Userinfo extends LaurieCommand {
  constructor() {
    super('userinfo', {
      category: 'discord',
      lock: 'guild',
      editable: false,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (msg: Message) => msg.member,
        },
      ],
    });
  }

  async exec(msg: Message, { member }: { member: GuildMember }) {
    const { author, guild } = msg;
    const { user, presence } = member;

    const status = msg.t(`commons:status:${presence.status}`);
    const statusEmoji = STATUS_EMOJIS[presence.status];

    const roles = member.roles.cache
      .array()
      .filter(role => role.id !== guild?.id)
      .sort((a, b) => b.position - a.position)
      .slice(0, 5)
      .map(role => role.toString());

    const roleMessage = roles.length > 0 ? roles.join(', ') : msg.t('commons:none');

    const embed = new LaurieEmbed(author)
      .addInfoText(
        'WALLET',
        msg.t('commands:userinfo.user_info', { username: user.username.toLowerCase() }),
        ['PERSON', msg.t('commons:name'), user.tag],
        ['COMPUTER', msg.t('commons:id'), user.id],
        [statusEmoji, msg.t('commons:status_e'), status],
        ['CALENDER', msg.t('commons:created_on'), getDate(user.createdAt)],
        ['INBOX', msg.t('commons:joined_on'), getDate(member.joinedAt as Date)],
        ['BRIEFCASE', msg.t('commons:roles'), roleMessage],
      )
      .setThumbnail(user.displayAvatarURL());
    msg.reply(embed);
  }
}
