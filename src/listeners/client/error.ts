import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import LaurieEmbed from '@structures/LaurieEmbed';

export default class ErrorListener extends Listener {
  constructor() {
    super('error-client', {
      emitter: 'client',
      event: 'error',
    });
  }

  exec(error: Error) {
    this.client.logger.error(error);
    const channel = this.client.channels.cache.get(process.env.ERROR_CHANNEL_ID as string);
    if (channel instanceof TextChannel) {
      channel.send(new LaurieEmbed(null, error.message, `\`\`\`bash\n${error.stack}\`\`\``).setColor('RED'));
    }
  }
}
