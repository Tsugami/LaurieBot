import Command, { TFunction } from '@struct/Command';
import Categories from '@struct/categories';
import { Message } from 'discord.js';
import LaurieEmbed from '@struct/LaurieEmbed';

class TicketCommand extends Command {
  constructor() {
    super('ticket', {
      category: 'configuration',
    });
  }

  run(msg: Message, t: TFunction) {
    const prefix = this.getPrefix(msg);
    return msg.reply(
      new LaurieEmbed(msg.author)
        .setAuthor(t('commands:ticket.title'))
        .addField(t('commands:ticket.what'), t('commands:ticket.what_message'))
        .addField(t('commands:ticket.how'), t('commands:ticket.how_message'))
        .addField(
          t('commons:commands'),
          Categories.ticket
            .map(x => `\`${prefix + x.aliases[0]}\` ${t(`commands:${x.id.replace('-', '_')}.description`)}`)
            .join('\n'),
        )
        .addField(t('commands:ticket.warn'), t('commands:ticket.warn_message', { prefix })),
    );
  }
}

export default TicketCommand;
