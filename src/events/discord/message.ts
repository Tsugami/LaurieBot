import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { deleteWordBannedMessage } from '@utils/ModuleUtils';

export default class MessageAddListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      eventName: 'message',
    });
  }

  async exec(message: Message) {
    deleteWordBannedMessage(message);
  }
}
