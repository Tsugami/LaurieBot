import { GuildDocument } from '@database/models/Guild';
import Base from './Base';
import TicketController from './TicketController';
import WelcomeController from './WelcomeController';
import WordFilterController from './WordFilterController';

class GuildController<T extends GuildDocument = GuildDocument> extends Base<T> {
  ticket = new TicketController(this.data);

  welcome = new WelcomeController(this.data);

  wordFilter = new WordFilterController(this.data);

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
