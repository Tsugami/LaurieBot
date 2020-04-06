import { Listener, Command } from 'discord-akairo';
import { Message, PermissionResolvable } from 'discord.js';
import { getFixedT } from '@utils/CommandUtils';

const ChannelDisabledCooldown = new Set<string>();
const CommandDisabledCooldown = new Set<string>();

function addUserCooldown(userId: string, set: Set<string>): void {
  set.add(userId);
  setTimeout(() => set.delete(userId), 2 * 60000);
}

function userIsCooldown(userId: string, set: Set<string>): boolean {
  return set.has(userId);
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
      if (permissions) return msg.reply(t('errors:user_permissions', { permissions }));
    }

    if (reason === 'clientPermissions') {
      const permissions = getPerm(command.clientPermissions);
      if (permissions) return msg.reply(t('errors:client_permissions', { permissions }));
    }

    if (
      reason === 'commands_disabled_on_the_current_channel' &&
      !userIsCooldown(msg.author.id, ChannelDisabledCooldown)
    ) {
      addUserCooldown(msg.author.id, ChannelDisabledCooldown);
      return msg.reply(t('errors:channel_disabled'));
    }

    if (reason === 'command_disabled' && !userIsCooldown(msg.author.id, CommandDisabledCooldown)) {
      addUserCooldown(msg.author.id, CommandDisabledCooldown);
      return msg.reply(t('errors:command_disabled'));
    }

    if (reason === 'guild') {
      return msg.reply(t('errors:guild'));
    }
  }
}
