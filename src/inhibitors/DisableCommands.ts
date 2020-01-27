import { Inhibitor } from 'discord-akairo';
import { guild } from '@database/index';

export default new Inhibitor(
  'commands',
  async (msg, commmand) => {
    if (msg.guild && !msg.member.permissions.has('ADMINISTRATOR') && commmand && commmand.id !== 'commands') {
      const guildData = await guild(msg.guild.id);
      const result = guildData.data.disableChannels.includes(msg.channel.id);
      if (result) return Promise.reject('blocked');
    }
  },
  {
    category: 'general',
    reason: 'disableCommands',
  },
);
