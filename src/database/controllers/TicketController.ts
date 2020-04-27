import { GuildDocument, CategoryTypes, RateTypes } from '@database/models/Guild';
import { TextChannel, User, Role, CategoryChannel, Guild } from 'discord.js';
import { Types } from 'mongoose';
import Base from './Base';

class TicketController extends Base<GuildDocument> {
  get ticket() {
    return this.data.ticket;
  }

  get active() {
    return this.ticket?.active;
  }

  get role() {
    return this.ticket?.role;
  }

  get categoryId() {
    return this.ticket?.categoryId;
  }

  get tickets() {
    return this.ticket?.tickets ?? [];
  }

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

  setRole(role: Role) {
    this.throwTicket();
    if (this.data.ticket) {
      if (role.id === this.data.ticket.role) {
        return this.data;
      }
      this.data.ticket.role = role.id;
      return this.save();
    }
  }

  setCategory(category: CategoryChannel) {
    this.throwTicket();
    if (this.data.ticket) {
      if (category.id === this.data.ticket.categoryId) {
        return this.data;
      }

      this.data.ticket.categoryId = category.id;

      return this.save();
    }
  }

  getTicket(user: User, guild: Guild) {
    this.throwTicket();

    if (!this.ticket || !this.ticket.tickets || !this.ticket.tickets.length) return null;
    return this.ticket.tickets.find(
      ticket => ticket.authorId === user.id && !ticket.closed && guild.channels.cache.has(ticket.channelId),
    );
  }

  async openTicket(channel: TextChannel, user: User, category: CategoryTypes) {
    this.throwTicket();
    if (!this.ticket) return;
    if (!this.ticket.tickets) this.ticket.tickets = [];

    this.ticket.tickets.push({
      channelId: channel.id,
      authorId: user.id,
      category,
    });

    await this.save();

    return this.ticket.tickets.find(t => t.channelId === channel.id);
  }

  async closeTicket(query: TextChannel | User) {
    this.throwTicket();
    if (!this.ticket) return;

    if (this.ticket.tickets) {
      let index = -1;
      if (query instanceof TextChannel) index = this.ticket.tickets.findIndex(t => t.channelId === query.id);
      if (query instanceof User) index = this.ticket.tickets.findIndex(t => t.authorId === query.id && !t.closed);

      if (index >= 0) {
        this.ticket.tickets[index].closed = true;
        await this.save();
        return this.ticket.tickets[index];
      }
      throw new Error('ticket não existe');
    }
  }

  ratingTicket(ticketId: Types.ObjectId, rate: RateTypes) {
    this.throwTicket();
    if (!this.ticket) return;

    if (this.ticket.tickets) {
      // eslint-disable-next-line no-underscore-dangle
      const index = this.ticket.tickets.findIndex(tk => tk._id && tk._id.equals(ticketId));
      if (index >= 0) {
        this.ticket.tickets[index].rate = rate;
        return this.save();
      }
    }
  }
}

export default TicketController;
