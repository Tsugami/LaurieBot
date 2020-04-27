import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import LaurieEmbed from '@structures/LaurieEmbed';
import LaurieCommand from '@structures/LaurieCommand';

export default class ErrorListener extends Listener {
  constructor() {
    super('error', {
      emitter: 'commandHandler',
      event: 'error',
    });
  }

  exec(error: Error, msg: Message, command: LaurieCommand) {
    command.logger.error(error);
    const channel = this.client.channels.cache.get(process.env.ERROR_CHANNEL_ID as string);
    if (channel instanceof TextChannel) {
      channel.send(
        new LaurieEmbed(null, error.message, `\`\`\`bash\n${error.stack}\`\`\``)
          .setColor('RED')
          .addField('Comando:', command.id)
          .addField('Mensagem:', msg.cleanContent),
      );
    }
  }
}
