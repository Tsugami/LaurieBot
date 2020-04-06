/* eslint-disable no-throw-literal */
import { Inhibitor } from 'discord-akairo';
import { guild } from '@database/index';
import {
  COMMANDS_THAT_CANNOT_BE_DISABLED,
  CATEGORIES_THAT_CANNOT_BE_DISABLED,
} from '../commands/configuration/cmdconfig';

export default new Inhibitor(
  'disable_command',
  async (msg, command) => {
    if (
      !msg.guild ||
      !command ||
      COMMANDS_THAT_CANNOT_BE_DISABLED.some(c => c.id === command.id) ||
      CATEGORIES_THAT_CANNOT_BE_DISABLED.some(c => c.id === command.category.id) ||
      msg.member.permissions.has('ADMINISTRATOR')
    )
      return;

    const guildData = await guild(msg.guild.id);
    if (guildData.disabledCommands.includes(command.id))
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject(false);
  },
  {
    category: 'general',
    reason: 'command_disabled',
  },
);
