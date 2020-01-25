import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      eventName: 'ready',
    });
  }

  exec() {
    const { client } = this;
    const bar = '-'.repeat(20)
    console.log(`
    Estou ligado!
    ${bar}
    NOME: ${client.user.username}
    PRFIX: ${client.akairoOptions.prefix}
    SERVIDORES: ${client.guilds.size}
    USUÁRIOS: ${client.users.size}
    ${bar}
    ${client.listenerHandler.modules.map(x=> x.id)}`);
  }
}
