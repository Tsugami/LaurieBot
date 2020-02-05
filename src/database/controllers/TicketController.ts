import { GuildDocument, CategoryTypes } from '@database/models/Guild';
import { TextChannel, User, Role } from 'discord.js';
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
      this.ticket = {
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
      this.ticket.role = role.id;

      return this.save();
    }
  }

  openTicket(channel: TextChannel, user: User, category: CategoryTypes) {
    if (!this.tickets) this.tickets = [];

    this.tickets.push({
      channelId: channel.id,
      authorId: user.id,
      category,
    });

    return this.save();
  }
}

export default TicketController;
