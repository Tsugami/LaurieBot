import Command from '@structures/LaurieCommand';
import { TextChannel, Message } from 'discord.js';

export default class FecharTk extends Command {
  constructor() {
    super('fechar-tk', {
      editable: false,
      aliases: ['fechar-ticket', 'close-tk', 'fechartk'],
      category: 'ticket',
      channel: 'guild',
      clientPermissions: 'MANAGE_CHANNELS',
    });
  }

  async exec(msg: Message) {
    const guildData = await this.client.database.getGuild(msg.guild?.id as string);

    if (!guildData.data.ticket) return;

    let ticket = guildData.data.ticket.tickets.find(tk => tk.channelId === msg.channel.id);
    if (!ticket) return msg.reply(msg.t('commands:fechar_tk.is_not_ticket_channel'));

    const hasPermission = () => {
      return (
        msg.member?.permissions.has('ADMINISTRATOR') ||
        (guildData.ticket.role && msg.member?.roles.cache.has(guildData.ticket.role)) ||
        ticket?.authorId === msg.author.id
      );
    };

    if (!hasPermission()) {
      return msg.reply(msg.t('commands:fechar_tk.have_no_power'));
    }

    ticket = await guildData.ticket.closeTicket(msg.channel as TextChannel);
    if (ticket) {
      msg.channel.delete();

      const user = msg.client.users.cache.get(ticket.authorId);
      const dm = user && (await user.createDM().catch(() => null));

      if (dm)
        dm.send(
          msg.t('commands:fechar_tk.request_rate', {
            guildName: msg.guild?.name,
            // eslint-disable-next-line no-underscore-dangle
            command: `rate-tk ${ticket._id}`,
          }),
        );
    }
  }
}
