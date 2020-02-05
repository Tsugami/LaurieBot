import Command, { TFunction, Prompt } from '@struct/Command';
import { Message, Role, TextChannel } from 'discord.js';
import { guild } from '@database/index';

export default class AtivarTicket extends Command {
  constructor() {
    super('setcargo-tk', {
      aliases: ['setcargo-ticket', 'setcargo-tk', 'setrole-tk'],
      help: 'setcargo-tk',
      category: 'ticket',
      clientPermissions: 'ADMINISTRATOR',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'role',
          type: 'role',
          prompt: {
            start: Prompt('commands:setcargo_tk.args.role.start'),
            retry: Prompt('commands:setcargo_tk.args.role.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: { role: Role }) {
    const guildData = await guild(msg.guild.id);
    await guildData.ticket.changeRole(args.role);

    msg.reply(t('commands:setcargo_tk.messasge'));

    if (!guildData.data.ticket) return;

    guildData.data.ticket.tickets.forEach(ticket => {
      if (!ticket.closed && msg.guild.channels.has(ticket.channelId)) {
        const channel = msg.guild.channels.get(ticket.channelId);
        if (channel instanceof TextChannel) {
          channel.overwritePermissions(args.role, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
          });
        }
      }
    });
  }
}
