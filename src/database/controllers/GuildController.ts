import { GuildDocument, WelcomeModule, TicketConfigModule, Ticket } from '@database/models/Guild';
import Base, { findFn } from './Base';

class GuildController<T extends GuildDocument = GuildDocument> extends Base<T> {
  private async save(): Promise<T> {
    await this.data.save();
    return this.data;
  }

  updateWelcome(data: WelcomeModule): Promise<T> {
    const dataObj = this.data.toObject();
    this.data.welcome = this.updateDataInArray(data, dataObj.welcome, x => x.channelId === data.channelId);
    return this.save();
  }

  disableChannel(channelId: string): Promise<T> {
    this.data.disableChannels = this.addArrayData(channelId, this.data.disableChannels);
    return this.save();
  }

  enableChannel(channelId: string): Promise<T> {
    this.data.disableChannels = this.removeArrayData(channelId, this.data.disableChannels);
    return this.save();
  }

  addPenaltyChannel(channelId: string): Promise<T> {
    this.data.penaltyChannels = this.addArrayData(channelId, this.data.penaltyChannels);
    return this.save();
  }

  removePenaltyChannel(channelId: string): Promise<T> {
    this.data.penaltyChannels = this.removeArrayData(channelId, this.data.penaltyChannels);
    return this.save();
  }

  updateTicket(data: TicketConfigModule): Promise<T> {
    if (this.data.ticket) {
      this.data.ticket = this.updateData(data, this.data.ticket);
    } else {
      this.data.ticket = data;
    }
    return this.save();
  }

  updateTickets(data: Ticket): Promise<T> | T {
    if (this.data.ticket) {
      const dataObj = this.data.toObject();
      const fn: findFn<Ticket> = x => x.authorId === data.authorId && !x.closed && x.channelId === data.channelId;
      this.data.ticket.tickets = this.updateDataInArray(data, dataObj.ticket.tickets || [], fn);
      return this.data.save();
    }
    return this.data;
  }

  deleteTicketModule(): Promise<T> {
    this.data.ticket = { channelId: '' };
    return this.save();
  }
}

export default GuildController;
