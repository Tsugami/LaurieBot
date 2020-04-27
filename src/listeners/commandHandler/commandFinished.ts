import { Listener, Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import LaurieEmbed from '@structures/LaurieEmbed';

export default class CommandFinishedListener extends Listener {
  constructor() {
    super('commandFinished', {
      emitter: 'commandHandler',
      event: 'commandFinished',
    });
  }

  exec(msg: Message, command: Command) {
    const channel = this.client.channels.cache.get(String(process.env.COMMAND_CHANNEL));
    if (channel instanceof TextChannel) {
      channel.send(
        new LaurieEmbed()
          .addField('Executado por', `${msg.author.tag} (${msg.author.id})`)
          .addField('Servidor', msg.guild ? msg.guild.name : 'Executado no Privado')
          .addField('Comando', command.id),
      );
    }
  }
}
