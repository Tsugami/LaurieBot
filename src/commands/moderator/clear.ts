import Command from '@structures/LaurieCommand';
import { Message } from 'discord.js';
import { Argument } from 'discord-akairo';

export default class Clear extends Command {
  constructor() {
    super('clear', {
      editable: true,
      aliases: ['limpar'],
      category: 'moderator',
      lock: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'amount',
          type: Argument.range('number', 1, 100),
          prompt: {
            start: (m: Message) => m.t('commands:clear.args.amount.start'),
            retry: (m: Message) => m.t('commands:clear.args.amount.retry'),
          },
        },
      ],
    });
  }

  async exec(msg: Message, { amount }: { amount: number }) {
    try {
      await msg.delete();
      const messagesDeleted = await msg.channel.bulkDelete(amount, true);
      let count = messagesDeleted.size;
      if (messagesDeleted.size !== amount) {
        try {
          const messages = await msg.channel.messages.fetch({ limit: amount - messagesDeleted.size });
          // eslint-disable-next-line no-restricted-syntax
          for (const m of messages.array()) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await m.delete();
              count += 1;
            } catch {} // eslint-disable-line no-empty
          }
        } catch {} // eslint-disable-line no-empty
      }
      return msg.reply(msg.t('commands:clear.messages_deleted', { amount: count }));
    } catch (error) {
      this.logger.error(error);
      return msg.reply(msg.t('commands:clear.failed'));
    }
  }
}
