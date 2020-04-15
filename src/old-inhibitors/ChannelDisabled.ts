/* eslint-disable no-throw-literal */
import { Inhibitor } from 'discord-akairo';
import { guild } from '@database/index';

export default new Inhibitor(
  'disable_channels',
  async (msg, command) => {
    if (!msg.guild || !command || msg.member.permissions.has('ADMINISTRATOR')) return;

    const guildData = await guild(msg.guild.id);
    if (guildData.disabledChannels.includes(msg.channel.id))
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject(false);
  },
  {
    category: 'general',
    reason: 'commands_disabled_on_the_current_channel',
  },
);
