import Command from '@struct/command/Command';
import Categories from '@struct/command/categories';
import LaurieEmbed from '@struct/LaurieEmbed';
import { guild } from '@database/index';

export default new Command(
  'ticket',
  {
    category: 'configuration',
  },
  async function run(msg, t) {
    const guildData = await guild(msg.guild.id);

    const prefix = this.getPrefix(msg);
    const embed = new LaurieEmbed(msg.author)
      .setAuthor(t('commands:ticket.title'))
      .addField(t('commands:ticket.what'), t('commands:ticket.what_message'))
      .addField(t('commands:ticket.how'), t('commands:ticket.how_message'))
      .addField(
        t('commons:commands'),
        Categories.ticket
          .map(x => `\`${prefix + x.aliases[0]}\` ${t(`commands:${x.id.replace('-', '_')}.description`)}`)
          .join('\n'),
      );
    if (!guildData.ticket.active) {
      embed.addField(t('commands:ticket.warn'), t('commands:ticket.warn_message', { command: `${prefix}tkconfig` }));
    }
    return msg.reply(embed);
  },
);
