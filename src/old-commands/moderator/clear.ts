import Command from '@struct/command/Command';
import { printError } from '@utils/Utils';

export default new Command(
  'clear',
  {
    aliases: ['limpar', 'prune'],
    category: 'moderator',
    channelRestriction: 'guild',
    userPermissions: 'MANAGE_MESSAGES',
    clientPermissions: 'MANAGE_MESSAGES',
    args: [
      {
        id: 'amount',
        type: 'number',
      },
    ],
  },
  async function run(msg, t, { amount }) {
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
            } catch {} // eslint-disable-line no-empty
          }
        } catch {} // eslint-disable-line no-empty
      }
      return msg.reply(t('commands:clear.messages_deleted', { amount: count }));
    } catch (error) {
      printError(error, this);
      return msg.reply(t('commands:clear.failed'));
    }
  },
);
