import { Listener } from 'discord-akairo';
import { TextChannel, RichEmbed } from 'discord.js';
import { ERROR_CHANNEL_ID } from '@utils/Constants';

export default class ClientErrorListener extends Listener {
  constructor() {
    super('clientError', {
      emitter: 'client',
      eventName: 'error',
    });
  }

  exec(error: Error) {
    console.error(error);
    const errorChannel = this.client.channels.get(ERROR_CHANNEL_ID);
    if (errorChannel instanceof TextChannel) {
      errorChannel.send(
        new RichEmbed()
          .setColor('RED')
          .setAuthor('CLIENT ERROR:')
          .setDescription(`\`\`\`\n${error.stack}\n\`\`\``),
      );
    }
  }
}
