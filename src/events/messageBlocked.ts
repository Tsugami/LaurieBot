import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js'

export default class BockedCommand extends Listener {
  constructor() {
    super('messageBlocked', {
      emitter: 'client',
      eventName: 'messageBlocked',
    });
  }

  exec(msg: Message, reason: string) {
    console.log('mensagem bloqueada: ', msg.content, reason)
  }
}
