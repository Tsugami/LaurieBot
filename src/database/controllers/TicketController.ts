import { GuildDocument, CategoryTypes, RateTypes } from '@database/models/Guild';
import { TextChannel, User, Role, CategoryChannel, Guild } from 'discord.js';
import { Types } from 'mongoose';
import Base from './Base';

class TicketController extends Base<GuildDocument> {
  private ticket = this.data.ticket;

  private tickets = this.data.ticket && this.data.ticket.tickets;

  throwTicket() {
    if (!this.data.ticket) {
      throw new Error('MODULO DESATIVADO');
    }
  }

  enable() {
    if (!this.data.ticket) {
      this.data.ticket = {
        active: true,
        tickets: [],
      };
    } else {
      this.data.ticket.active = true;
    }

    return this.save();
  }

  async disable() {
    this.throwTicket();

    const oldData = this.ticket;
    this.data.ticket = {
      active: false,
      role: '',
      categoryId: '',
      tickets: [],
    };

    await this.save();
    return oldData;
  }

  changeRole(role: Role) {
    this.throwTicket();
    if (this.ticket) {
      if (role.id === this.ticket.role) {
        return this.data;
      }

      this.ticket.role = role.id;

      return this.save();
    }
  }

  changeCategory(category: CategoryChannel) {
    this.throwTicket();
    if (this.ticket) {
      if (category.id === this.ticket.categoryId) {
        return this.data;
      }

      this.ticket.categoryId = category.id;

      return this.save();
    }
  }

  getTicket(user: User, guild: Guild) {
    this.throwTicket();

    if (!this.tickets || !this.tickets.length) return null;
    return this.tickets.find(
      ticket => ticket.authorId === user.id && !ticket.closed && guild.channels.has(ticket.channelId),
    );
  }

  async openTicket(channel: TextChannel, user: User, category: CategoryTypes) {
    this.throwTicket();

    if (!this.tickets) this.tickets = [];

    this.tickets.push({
      channelId: channel.id,
      authorId: user.id,
      category,
    });

    await this.save();

    return this.tickets.find(t => t.channelId === channel.id);
  }

  async closeTicket(query: TextChannel | User) {
    this.throwTicket();

    if (this.tickets) {
      let index = -1;
      if (query instanceof TextChannel) index = this.tickets.findIndex(t => t.channelId === query.id);
      if (query instanceof User) index = this.tickets.findIndex(t => t.authorId === query.id && !t.closed);

      if (index >= 0) {
        this.tickets[index].closed = true;
        await this.save();
        return this.tickets[index];
      }
      throw new Error('ticket não existe');
    }
  }

  ratingTicket(ticketId: Types.ObjectId, rate: RateTypes) {
    if (this.tickets) {
      // eslint-disable-next-line no-underscore-dangle
      const index = this.tickets.findIndex(tk => tk._id && tk._id.equals(ticketId));
      if (index >= 0) {
        this.tickets[index].rate = rate;
        return this.save();
      }
    }
  }
}

export default TicketController;
