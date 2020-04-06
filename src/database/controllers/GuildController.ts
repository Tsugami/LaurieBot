import { GuildDocument } from '@database/models/Guild';
import Base from './Base';
import TicketController from './TicketController';
import WelcomeController from './WelcomeController';
import WordFilterController from './WordFilterController';

class GuildController extends Base<GuildDocument> {
  ticket = new TicketController(this.data);

  welcome = new WelcomeController(this.data);

  wordFilter = new WordFilterController(this.data);

  disabledChannels = this.data.disabledChannels;

  disabledCommands = this.data.disabledCommands;

  disableChannel(channelId: string) {
    this.data.disabledChannels.push(channelId);
    return this.save();
  }

  disableCommand(commandId: string) {
    this.data.disabledCommands.push(commandId);
    return this.save();
  }

  enableChannel(channelId: string) {
    this.data.disabledChannels = this.data.disabledChannels.filter(id => id !== channelId);
    return this.save();
  }

  enableCommands(commandId: string) {
    this.data.disabledCommands = this.data.disabledCommands.filter(id => id !== commandId);
    return this.save();
  }

  setPenaltyChannel(channelId: string) {
    this.data.penaltyChannel = channelId;
    return this.save();
  }

  removePenaltyChannel() {
    this.data.penaltyChannel = null;
    return this.save();
  }
}

export default GuildController;
