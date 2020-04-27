import Command from '@structures/LaurieCommand';
import { Ticket } from '@database/models/Guild';
import LaurieEmbed from '@structures/LaurieEmbed';
import { TICKET_EMOJIS, RATE_EMOJIS } from '@utils/constants';
import { Message } from 'discord.js';

const toFixed = (num: number) => num.toFixed(1);

export default class StatusTk extends Command {
  constructor() {
    super('status-tk', {
      editable: true,
      aliases: ['status-ticket'],
      category: 'ticket',
    });
  }

  async exec(msg: Message) {
    const { ticket } = await this.client.database.getGuild(msg.guild?.id as string);

    if (!ticket) return;

    const parent = ticket.categoryId && msg.guild?.channels.cache.get(ticket.categoryId);
    const category = parent ? parent.toString() : msg.t('commands:status_tk.not_parent');

    const rolex = ticket.role && msg.guild?.roles.cache.get(ticket.role);
    const role = rolex ? rolex.toString() : msg.t('commands:status_tk.not_role');

    const tickets = ticket.tickets
      ? `${ticket.tickets.filter(c => c.closed).length}/${ticket.tickets.length}`
      : msg.t('commands:status_tk.not_tickets');

    const porc = <E, T extends keyof Ticket, A extends Ticket[T]>(emojis: E, key: T) => (value: A, emoji: keyof E) =>
      `${
        ticket.tickets
          ? toFixed((ticket.tickets.filter(tk => tk[key] === value).length / ticket.tickets.length) * 100)
          : 0
      }% ${emojis[emoji]}`;

    const categoryP = porc(TICKET_EMOJIS, 'category');
    const categories = `${categoryP('question', 'QUESTION')} ${categoryP('report', 'REPORT')} ${categoryP(
      'review',
      'REVIEW',
    )}`;

    const ratingP = porc(RATE_EMOJIS, 'rate');
    const ticketNotRate = ticket.tickets?.filter(tk => tk.closed && !tk.rate).length;
    const rating = `${ratingP('good', 'good')} ${ratingP('bad', 'bad')} ${ratingP('normal', 'normal')} ${
      ticketNotRate
        ? `\n${msg.t('commands:status_tk.tickets_not_rate', {
            tickets: toFixed((ticketNotRate / ticket.tickets.length) * 100),
          })}`
        : ''
    }`;

    msg?.util?.reply(
      new LaurieEmbed(msg.author).addInfoText(
        'BALLOT_BOX',
        msg.t('commands:status_tk.status_info'),
        ['SPEECH_BALLON', msg.t('commands:status_tk.parent'), category],
        ['BRIEFCASE', msg.t('commands:status_tk.role'), role],
        ['TICKET', msg.t('commands:status_tk.tickets'), tickets],
        [TICKET_EMOJIS.REPORT, msg.t('commands:status_tk.ticket_categories'), categories],
        ['STRONKS', msg.t('commands:status_tk.ticket_rating'), rating],
      ),
    );
  }
}
