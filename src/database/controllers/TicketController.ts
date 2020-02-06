import { GuildDocument, CategoryTypes } from '@database/models/Guild';
import { TextChannel, User, Role, CategoryChannel, Guild } from 'discord.js';
import Base from './Base';

class TicketController extends Base<GuildDocument> {
  private ticket = this.data.ticket;

  private tickets = this.data.ticket && this.data.ticket.tickets;

  enable() {
    if (!this.ticket) {
      this.ticket = {
        active: true,
        tickets: [],
      };
    } else {
      this.ticket.active = true;
    }

    return this.save();
  }

  async disable() {
    if (this.ticket) {
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
  }

  changeRole(role: Role) {
    if (this.ticket) {
      if (role.id === this.ticket.role) {
        return this.data;
      }

      this.ticket.role = role.id;

      return this.save();
    }
  }

  changeCategory(category: CategoryChannel) {
    if (this.ticket) {
      if (category.id === this.ticket.categoryId) {
        return this.data;
      }

      this.ticket.categoryId = category.id;

      return this.save();
    }
  }

  getTicket(user: User, guild: Guild) {
    if (!this.tickets || !this.tickets.length) return null;
    return this.tickets.find(
      ticket => ticket.authorId === user.id && !ticket.closed && guild.channels.has(ticket.channelId),
    );
  }

  async openTicket(channel: TextChannel, user: User, category: CategoryTypes) {
    if (!this.tickets) this.tickets = [];

    this.tickets.push({
      channelId: channel.id,
      authorId: user.id,
      category,
    });

    await this.save();

    return this.tickets.find(t => t.channelId === channel.id);
  }

  async closeTicket(query: TextChannel | User, closedBy: User, date = new Date()) {
    if (this.tickets) {
      let index = -1;
      if (query instanceof TextChannel) index = this.tickets.findIndex(t => t.channelId === query.id);
      if (query instanceof User) index = this.tickets.findIndex(t => t.authorId === query.id && !t.closed);

      if (index >= 0) {
        this.tickets[index].closed = true;
        await this.save();
        return this.tickets[index];
      }
    }
  }
}

export default TicketController;
