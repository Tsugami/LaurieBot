import { Listener, Command } from 'discord-akairo';
import { Message, PermissionResolvable } from 'discord.js';
import { getFixedT } from '@struct/Command';

const disableCommandsCooldown = new Set<string>();

function addUserCooldown(userId: string): void {
  disableCommandsCooldown.add(userId);
  setTimeout(() => disableCommandsCooldown.delete(userId), 2 * 60000);
}

function userIsCooldown(userId: string): boolean {
  return disableCommandsCooldown.has(userId);
}

const bold = (str: string) => `**${str}**`;

export default class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked',
    });
  }

  exec(msg: Message, command: Command, reason: string) {
    const t = getFixedT(msg);

    const getPerm = (perms: PermissionResolvable[] | PermissionResolvable | any): string | null => {
      if (typeof perms === 'string') return bold(t(`permissions:${perms}`));
      if (Array.isArray(perms)) return perms.map(x => bold(t(`permissions:${x}`))).join(', ');
      return null;
    };

    if (reason === 'userPermissions') {
      const permissions = getPerm(command.userPermissions);
      if (permissions) return msg.reply(t('errors:userPermissions', { permissions }));
    }

    if (reason === 'clientPermissions') {
      const permissions = getPerm(command.clientPermissions);
      if (permissions) return msg.reply(t('errors:userPermissions', { permissions }));
    }

    if (reason === 'disableCommands' && !userIsCooldown(msg.author.id)) {
      addUserCooldown(msg.author.id);
      return msg.reply(t('errors:disableCommands'));
    }

    if (reason === 'guild') {
      return msg.reply(t('errors:guild'));
    }
  }
}
