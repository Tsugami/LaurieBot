import { Message, Client } from 'discord.js';

export default class CooldownSet {
  private ids = new Set<string>();

  constructor(public client: Client, public cooldown: number, public command = false) {
    this.client = client;
    this.command = command;
    this.cooldown = cooldown;
  }

  has(message: Message) {
    return this.ids.has(this.parseId(message));
  }

  add(message: Message) {
    const id = this.parseId(message);
    this.ids.add(id);
    this.client.setTimeout(() => this.ids.delete(id), this.cooldown);
    return this;
  }

  parseId(message: Message) {
    let id = `${message.author.id}:${message.channel.id}`;
    const command = this.command && message.util?.parsed?.command;
    if (command) id += `:${command.id}`;
    return id;
  }
}
