import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import Command from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';

export default class CommandBlockedAddListener extends Listener {
  // userId:channelId:commandId
  disabledCommand = new Set<string>();

  disabledChannel = new Set<string>();

  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
    });
  }

  async exec(message: Message, command: Command, reason: string) {
    switch (reason) {
      case 'disabledCommand': {
        const id = this.parseID(message, command);
        if (this.disabledCommand.has(id)) break;
        this.addCooldown(this.disabledCommand, id);
        message.reply(new LaurieEmbed(null, message.t('errors:command_disabled')));
        break;
      }

      case 'disabledChannel': {
        const id = this.parseID(message, command);
        if (this.disabledChannel.has(id)) break;
        this.addCooldown(this.disabledChannel, id);
        message.reply(new LaurieEmbed(null, message.t('errors:channel_disabled')));
        break;
      }

      default:
        break;
    }
  }

  addCooldown(collection: Set<string>, id: string) {
    collection.add(id);
    this.client.setTimeout(() => collection.delete(id), 3 * 60000);
  }

  parseID(message: Message, command: Command) {
    return `${message.author.id}:${message.channel.id}:${command.id}`;
  }
}
