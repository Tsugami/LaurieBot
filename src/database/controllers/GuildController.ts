import { GuildDocument, WelcomeModule } from '@database/models/Guild';
import Base from './Base';
import TicketController from './TicketController';

class GuildController<T extends GuildDocument = GuildDocument> extends Base<T> {
  public ticket = new TicketController(this.data);

  updateWelcome(data: WelcomeModule): Promise<T> {
    this.data.welcome = data;
    return this.save();
  }

  disableWelcome(): Promise<T> {
    this.data.welcome = null;
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

  setPenaltyChannel(channelId: string): Promise<T> {
    this.data.penaltyChannel = channelId;
    return this.save();
  }

  removePenaltyChannel(): Promise<T> {
    this.data.penaltyChannel = null;
    return this.save();
  }
}

export default GuildController;
