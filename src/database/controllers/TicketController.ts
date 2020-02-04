import { GuildDocument, CategoryTypes } from '@database/models/Guild';
import { TextChannel, User, Role } from 'discord.js';
import Base from './Base';
import ControllerError from './ControllerError';

class TicketController extends Base<GuildDocument> {
  private ticket = this.data.ticket;

  private tickets = this.data.ticket && this.data.ticket.tickets;

  enable(role?: Role) {
    if (!this.ticket) {
      this.ticket = {
        active: true,
        tickets: [],
      };
    } else {
      this.ticket.active = true;
    }

    if (role) {
      this.ticket.role = role.id;
    }

    return this.save();
  }

  async disable() {
    if (this.ticket) {
      const oldData = this.ticket;
      this.ticket = {
        active: false,
        role: '',
        tickets: [],
      };

      await this.save();
      return oldData;
    }
  }

  changeRole(role: Role) {
    if (this.ticket) {
      if (role.id === this.ticket.role) {
        throw new ControllerError('this_is_the_current_ticket_role');
      }

      this.ticket.role = role.id;

      return this.save();
    }
  }

  openTicket(channel: TextChannel, user: User, category: CategoryTypes) {
    if (!this.tickets) this.tickets = [];

    if (this.tickets.find(x => x.authorId === user.id && x.channelId === channel.id && x.closed)) {
      throw new ControllerError('already_has_ticket_open');
    }

    this.tickets.push({
      channelId: channel.id,
      authorId: user.id,
      category,
    });

    return this.save();
  }
}

export default TicketController;
