import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import Command from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import CooldownSet from '@utils/cooldown';

export default class CommandBlockedAddListener extends Listener {
  disabledCommand = new CooldownSet(this.client, 3 * 60000, true);

  disabledChannel = new CooldownSet(this.client, 3 * 60000, true);

  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      event: 'commandBlocked',
    });
  }

  async exec(message: Message, command: Command, reason: string) {
    switch (reason) {
      case 'disabledCommand': {
        if (this.disabledCommand.has(message)) break;
        this.disabledCommand.add(message);
        message.reply(new LaurieEmbed(null, message.t('errors:command_disabled')));
        break;
      }

      case 'disabledChannel': {
        if (this.disabledChannel.has(message)) break;
        this.disabledChannel.add(message);
        message.reply(new LaurieEmbed(null, message.t('errors:channel_disabled')));
        break;
      }

      case 'guild': {
        message.reply(new LaurieEmbed(message.t('errors:guild')));
        break;
      }

      case 'ticket': {
        message.reply(new LaurieEmbed(message.t('errors:ticket')));
        break;
      }

      default:
        break;
    }
  }
}
