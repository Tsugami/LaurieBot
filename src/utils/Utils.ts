import { Command } from 'discord-akairo';
import { Client, Message, TextChannel, RichEmbed } from 'discord.js';
import { ERROR_CHANNEL_ID } from '@utils/Constants';

export function printError(error: Error, client?: Client, message?: Message, command?: Command) {
  // eslint-disable-next-line no-console
  console.error(error);
  const errorChannel = client?.channels.get(ERROR_CHANNEL_ID);
  if (errorChannel instanceof TextChannel) {
    errorChannel.send(
      new RichEmbed()
        .setColor('RED')
        .setAuthor(error.message)
        .addField('MESSAGE:', message?.cleanContent || 'N')
        .addField('COMMAND ID:', command?.id || 'N')
        .setDescription(`\`\`\`\n${error.stack}\n\`\`\``),
    );
  }
}
