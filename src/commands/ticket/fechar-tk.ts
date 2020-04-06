import Command from '@struct/command/Command';
import { TextChannel } from 'discord.js';
import { guild } from '@database/index';

export default new Command(
  'fechar-tk',
  {
    aliases: ['fechar-ticket', 'fechar-tk', 'close-tk'],
    category: 'ticket',
    clientPermissions: 'MANAGE_CHANNELS',
  },
  async function run(msg, t) {
    if (!(msg.channel instanceof TextChannel)) return;

    const guildData = await guild(msg.guild.id);

    if (!guildData.data.ticket) return;

    let ticket = guildData.data.ticket.tickets.find(tk => tk.channelId === msg.channel.id);
    if (!ticket) return msg.reply(t('commands:fechar_tk.is_not_ticket_channel'));
    if (
      !msg.member.permissions.has('ADMINISTRATOR') ||
      !msg.member.roles.has(String(guildData.ticket.role)) ||
      ticket.authorId !== msg.member.id
    ) {
      return msg.reply(t('commands:fechar_tk.have_no_power'));
    }

    ticket = await guildData.ticket.closeTicket(msg.channel);
    if (ticket) {
      msg.channel.delete();

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
  },
);
