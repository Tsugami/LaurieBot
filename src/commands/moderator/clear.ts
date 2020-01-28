import Command, { TFunction, Prompt } from '@struct/Command';
import { Message } from 'discord.js';

interface ArgsI {
  amount: number;
}

class ClearCommand extends Command {
  constructor() {
    super('clear', {
      aliases: ['clear', 'prune', 'limpar'],
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
      await msg.channel.bulkDelete(amount);
      return msg.reply(t('commads:clear.messages_deleted', { amount }));
    } catch (error) {
      console.error(error);
      return msg.reply(t('commands:clear.failed'));
    }
  }
}

export default ClearCommand;
