import { Message } from 'discord.js';

export default class CooldownSet {
  private ids = new Set<string>();

  constructor(public cooldown: number, public command = false) {
    this.command = command;
    this.cooldown = cooldown;
  }

  has(message: Message) {
    return this.ids.has(this.parseId(message));
  }

  add(message: Message) {
    const id = this.parseId(message);
    this.ids.add(id);
    setTimeout(() => this.ids.delete(id), this.cooldown);
    return this;
  }

  parseId(message: Message) {
    let id = `${message.author.id}:${message.channel.id}`;
    const command = this.command && message.util?.parsed?.command;
    if (command) id += `:${command.id}`;
    return id;
  }
}
