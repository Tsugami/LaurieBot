import LaurieEmbed from '@struct/LaurieEmbed';
import LaurieCommand from '@struct/command/Command';

export default new LaurieCommand(
  'avatar',
  {
    category: 'discord',
    args: [{ id: 'user' as const, type: 'user', default: msg => msg.author }],
  },
  (msg, t, { user }) => {
    const embed = new LaurieEmbed(msg.author)
      .setAuthor(`📸 ${user.username}`)
      .setDescription(t('commands:avatar.embed_description', { avatarUrl: user.displayAvatarURL }))
      .setImage(user.displayAvatarURL);
    msg.reply(embed);
  },
);
