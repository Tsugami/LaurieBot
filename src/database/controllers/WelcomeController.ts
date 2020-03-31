import { GuildDocument } from '@database/models/Guild';
import Base from './Base';

class WelcomeController extends Base<GuildDocument> {
  readonly message = this.data.welcome?.message;

  readonly channelId = this.data.welcome?.channelId;

  enable(channelId: string, message: string) {
    this.data.welcome = {
      channelId,
      message,
    };

    return this.save();
  }

  setMessage(message: string) {
    if (this.data.welcome) {
      this.data.welcome.message = message;
    }

    return this.save();
  }

  setChannel(channelId: string) {
    if (this.data.welcome) {
      this.data.welcome.channelId = channelId;
    }

    return this.save();
  }

  disable() {
    this.data.welcome = null;
    return this.save();
  }
}

export default WelcomeController;
