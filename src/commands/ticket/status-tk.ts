import Command from '@struct/command/Command';
import { guild } from '@database/index';
import { Ticket } from '@database/models/Guild';
import LaurieEmbed from '@struct/LaurieEmbed';
import { TICKET_EMOJIS, RATE_EMOJIS } from '@utils/Constants';

const toFixed = (num: number) => num.toFixed(1);
export default new Command(
  'status-tk',
  {
    aliases: ['status-ticket', 'status-tk'],
    category: 'ticket',
  },
  async (msg, t) => {
    const guildData = await guild(msg.guild.id);
    const { ticket } = guildData.data;

    if (!ticket) return;

    const parent = ticket.categoryId && msg.guild.channels.get(ticket.categoryId);
    const category = parent ? parent.toString() : t('commands:status_tk.not_parent');

    const rolex = ticket.role && msg.guild.roles.get(ticket.role);
    const role = rolex ? rolex.toString() : t('commands:status_tk.not_role');

    const tickets = ticket.tickets.length
      ? `${ticket.tickets.filter(c => c.closed).length}/${ticket.tickets.length}`
      : t('commands:status_tk.not_tickets');

    const porc = <E, T extends keyof Ticket, A extends Ticket[T]>(emojis: E, key: T) => (value: A, emoji: keyof E) =>
      `${
        ticket.tickets.length
          ? toFixed((ticket.tickets.filter(tk => tk[key] === value).length / ticket.tickets.length) * 100)
          : 0
      }% ${emojis[emoji]}`;

    const categoryP = porc(TICKET_EMOJIS, 'category');
    const categories = `${categoryP('question', 'QUESTION')} ${categoryP('report', 'REPORT')} ${categoryP(
      'review',
      'REVIEW',
    )}`;

    const ratingP = porc(RATE_EMOJIS, 'rate');
    const ticketNotRate = ticket.tickets.filter(tk => tk.closed && !tk.rate).length;
    const rating = `${ratingP('good', 'good')} ${ratingP('bad', 'bad')} ${ratingP('normal', 'normal')} ${
      ticketNotRate
        ? `\n${t('commands:status_tk.tickets_not_rate', {
            tickets: toFixed((ticketNotRate / ticket.tickets.length) * 100),
          })}`
        : ''
    }`;

    msg.reply(
      new LaurieEmbed(msg.author).addInfoText(
        'BALLOT_BOX',
        t('commands:status_tk.status_info'),
        ['SPEECH_BALLON', t('commands:status_tk.parent'), category],
        ['BRIEFCASE', t('commands:status_tk.role'), role],
        ['TICKET', t('commands:status_tk.tickets'), tickets],
        [TICKET_EMOJIS.REPORT, t('commands:status_tk.ticket_categories'), categories],
        ['STRONKS', t('commands:status_tk.ticket_rating'), rating],
      ),
    );
  },
);
