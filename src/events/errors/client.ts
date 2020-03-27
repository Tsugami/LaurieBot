import { Listener } from 'discord-akairo';
import { printError } from '@utils/Utils';

export default class ClientErrorListener extends Listener {
  constructor() {
    super('clientError', {
      emitter: 'client',
      eventName: 'error',
    });
  }

  exec(error: Error) {
    printError(error, this.client);
  }
}
