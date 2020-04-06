import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import CustomCommand from '@struct/command/Command';
import { printError } from '@utils/Utils';

export default class CommandHandlerErrorListener extends Listener {
  constructor() {
    super('commandHandlerError', {
      emitter: 'commandHandler',
      eventName: 'error',
    });
  }

  exec(error: Error, message: Message, command: CustomCommand) {
    printError(error, this.client, message, command);
  }
}
