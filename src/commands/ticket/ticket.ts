import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';
import Embed from '@utils/Embed';

class TicketCommand extends Command {
  constructor() {
    super('ticket', {
      aliases: ['ticket'],
      help: 'ticket',
      category: 'configuration',
    });
  }

  run(msg: Message, t: TFunction) {
    return msg.reply(
      new Embed(msg.author).setDescription(
        t('modules:ticket.about', {
          prefix: this.getPrefix(msg),
        }),
      ),
    );
  }
}

export default TicketCommand;
