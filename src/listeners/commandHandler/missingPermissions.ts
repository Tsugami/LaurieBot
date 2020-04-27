import { Listener } from 'discord-akairo';
import { Message, PermissionString } from 'discord.js';
import Command from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';

export default class MissingPermissionsListener extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions',
    });
  }

  async exec(
    message: Message,
    command: Command,
    type: 'user' | 'client',
    missing: PermissionString[] | PermissionString,
  ) {
    let permissions: string;

    if (typeof missing === 'string') permissions = `${message.t(`permissions:${missing}`)}`;
    else permissions = missing.map(x => `${message.t(`permissions:${x}`)}`).join(', ');

    if (type === 'client') {
      return message.reply(new LaurieEmbed(null, message.t('errors:client_permissions', { permissions })));
    }
    return message.reply(new LaurieEmbed(null, message.t('errors:user_permissions', { permissions })));
  }
}
