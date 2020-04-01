import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, CategoryChannel, TextChannel } from 'discord.js';
import { guild } from '@database/index';

export default class SetCategoriaTicket extends Command {
  constructor() {
    super('setcategoria-tk', {
      aliases: ['setcategoria-ticket', 'setcategoria-tk', 'setcategory-tk'],
      category: 'ticket',
      clientPermissions: 'ADMINISTRATOR',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'category',
          type: 'categoryChannel',
          prompt: {
            start: Prompt('commands:setcategoria_tk.args.category.start'),
            retry: Prompt('commands:setcategoria_tk.args.category.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: { category: CategoryChannel }) {
    const guildData = await guild(msg.guild.id);
    await guildData.ticket.changeCategory(args.category);

    msg.reply(t('commands:setcategoria_tk.message'));

    if (!guildData.data.ticket) return;

    guildData.data.ticket.tickets.forEach(ticket => {
      if (!ticket.closed && msg.guild.channels.has(ticket.channelId)) {
        const channel = msg.guild.channels.get(ticket.channelId);
        if (channel instanceof TextChannel) {
          channel.setParent(args.category);
        }
      }
    });
  }
}
