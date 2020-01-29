"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');

 class ReadyListener extends _discordakairo.Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      eventName: 'ready',
    });
  }

  exec() {
    const { client } = this;
    const bar = '-'.repeat(20);
    console.log(`
    Estou ligado!
    ${bar}
    NOME: ${client.user.username}
    PRFIX: ${client.akairoOptions.prefix}
    SERVIDORES: ${client.guilds.size}
    USUÁRIOS: ${client.users.size}
    ${bar}`);
  }
} exports.default = ReadyListener;
