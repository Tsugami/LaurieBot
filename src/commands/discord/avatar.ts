import LaurieEmbed from '@struct/LaurieEmbed';
import Command from '@struct/Command';

export default new Command(
  'avatar',
  {
    category: 'discord',
    args: [{ id: 'user', type: 'user', default: msg => msg.author }],
  },
  (msg, t, { user }) => {
    const embed = new LaurieEmbed(msg.author)
      .setAuthor(`📸 ${user.username}`)
      .setDescription(t('commands:avatar.embed_description', { avatarUrl: user.displayAvatarURL }))
      .setImage(user.displayAvatarURL);
    msg.reply(embed);
  },
);
