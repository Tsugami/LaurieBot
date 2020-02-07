import { Listener } from 'discord-akairo';
import { TextChannel, RichEmbed, Message } from 'discord.js';
import { ERROR_CHANNEL_ID } from '@utils/Constants';
import CustomCommand from '@struct/Command';

export default class CommandHandlerErrorListener extends Listener {
  constructor() {
    super('commandHandlerError', {
      emitter: 'commandHandler',
      eventName: 'error',
    });
  }

  exec(error: Error, message: Message, command: CustomCommand) {
    console.error(error);
    const errorChannel = this.client.channels.get(ERROR_CHANNEL_ID);
    if (errorChannel instanceof TextChannel) {
      errorChannel.send(
        new RichEmbed()
          .setColor('RED')
          .setAuthor('COMMAND_HANDLER ERROR:')
          .addField('MESSAGE:', message.cleanContent)
          .addField('COMMAND ID:', command.id)
          .setDescription(`\`\`\`\n${error.stack}\n\`\`\``),
      );
    }
  }
}
