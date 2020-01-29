"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');

var _Command = require('@struct/Command');

const disableCommandsCooldown = new Set();

function addUserCooldown(userId) {
  disableCommandsCooldown.add(userId);
  setTimeout(() => disableCommandsCooldown.delete(userId), 2 * 60000);
}

function userIsCooldown(userId) {
  return disableCommandsCooldown.has(userId);
}

const bold = (str) => `**${str}**`;

 class CommandBlockedListener extends _discordakairo.Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked',
    });
  }

  exec(msg, command, reason) {
    const t = _Command.getFixedT.call(void 0, msg);

    const getPerm = (perms) => {
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
} exports.default = CommandBlockedListener;
