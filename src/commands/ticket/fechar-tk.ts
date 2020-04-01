import Command, { TFunction } from '@struct/Command';
import { Message, GuildMember, TextChannel } from 'discord.js';
import { guild } from '@database/index';
import { TicketConfigModule, Ticket } from '@database/models/Guild';

export default class FecharTicket extends Command {
  constructor() {
    super('fechar-tk', {
      aliases: ['fechar-ticket', 'fechar-tk', 'close-tk'],
      category: 'ticket',
      clientPermissions: 'MANAGE_CHANNELS',
    });
  }

  async run(msg: Message, t: TFunction) {
    if (!(msg.channel instanceof TextChannel)) return;

    const guildData = await guild(msg.guild.id);

    if (!guildData.data.ticket) return;

    let ticket = guildData.data.ticket.tickets.find(tk => tk.channelId === msg.channel.id);
    if (!ticket) return msg.reply(t('commands:fechar_tk.is_not_ticket_channel'));
    if (!this.hasTicketPermission(guildData.data.ticket, ticket, msg.member)) {
      return msg.reply(t('commands:fechar_tk.have_no_power'));
    }

    ticket = await guildData.ticket.closeTicket(msg.channel);
    if (ticket) {
      msg.channel.delete();

      // request rate
      const user = msg.client.users.get(ticket.authorId);
      const dm = user && (await user.createDM().catch(() => null));

      if (dm)
        dm.send(
          t('commands:fechar_tk.request_rate', {
            guildName: msg.guild.name,
            // eslint-disable-next-line no-underscore-dangle
            command: `${this.getPrefix(msg)}rate-tk ${ticket._id}`,
          }),
        );
    }
  }

  hasTicketPermission(config: TicketConfigModule, ticket: Ticket, user: GuildMember) {
    return user.permissions.has('ADMINISTRATOR') || user.roles.has(String(config.role)) || ticket.authorId === user.id;
  }
}
