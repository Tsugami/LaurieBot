import Command, { TFunction, Prompt } from '@struct/Command';
import { Message } from 'discord.js';

interface ArgsI {
  amount: number;
}

class ClearCommand extends Command {
  constructor() {
    super('clear', {
      aliases: ['limpar', 'prune'],
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'MANAGE_MESSAGES',
      args: [
        {
          id: 'amount',
          type: 'number',
          prompt: {
            start: Prompt('commands:clear.args.amount.start'),
            retry: Prompt('commands:clear.args.amount.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    let { amount } = args;

    if (amount > 100) amount = 100;
    else if (amount < 1) amount = 1;

    try {
      await msg.delete();
      const messagesDeleted = await msg.channel.bulkDelete(amount, true);
      let count = messagesDeleted.size;
      if (messagesDeleted.size !== amount) {
        try {
          const messages = await msg.channel.fetchMessages({ limit: amount - messagesDeleted.size });
          // eslint-disable-next-line no-restricted-syntax
          for (const m of messages.array()) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await m.delete();
              count += 1;
              // eslint-disable-next-line no-empty
            } catch {}
          }
          // eslint-disable-next-line no-empty
        } catch {}
      }
      return msg.reply(t('commands:clear.messages_deleted', { amount: count }));
    } catch (error) {
      this.printError(error, msg);
      return msg.reply(t('commands:clear.failed'));
    }
  }
}

export default ClearCommand;
