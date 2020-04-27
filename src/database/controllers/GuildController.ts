import { GuildDocument } from '@database/models/Guild';
import { Command } from 'discord-akairo';
import Base from './Base';
import TicketController from './TicketController';
import WelcomeController from './WelcomeController';
import WordFilterController from './WordFilterController';

class GuildController extends Base<GuildDocument> {
  ticket = new TicketController(this.data);

  welcome = new WelcomeController(this.data);

  wordFilter = new WordFilterController(this.data);

  get disabledChannels() {
    return this.data.disabledChannels;
  }

  get disabledCommands() {
    return this.data.disabledCommands;
  }

  get penaltyChannel() {
    return this.data.penaltyChannel;
  }

  disableChannel(channelId: string) {
    this.data.disabledChannels.push(channelId);
    return this.save();
  }

  disableCommand(resolve: string | Command | Command[]) {
    const resolved = this.resolveCommandInput(resolve);
    if (typeof resolved === 'string') {
      this.data.disabledCommands.push(resolved);
    } else {
      for (const id of resolved) {
        this.data.disabledCommands.push(id);
      }
    }

    return this.save();
  }

  enableCommands(resolve: string | Command | Command[]) {
    const resolved = this.resolveCommandInput(resolve);
    if (typeof resolved === 'string') {
      this.data.disabledCommands.push(resolved);
    } else {
      for (const id of resolved) {
        this.data.disabledCommands.push(id);
      }
    }

    return this.save();
  }

  resolveCommandInput(resolve: string | Command | Command[]): string | string[] {
    if (typeof resolve === 'string') return resolve;
    if (resolve instanceof Command) return resolve.id;
    return resolve.map(c => c.id);
  }

  enableChannel(channelId: string) {
    this.data.disabledChannels = this.data.disabledChannels.filter(id => id !== channelId);
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
