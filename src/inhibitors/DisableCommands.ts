import { Inhibitor } from 'discord-akairo';
import { guild } from '../database';


export default new Inhibitor('commands', async (msg, commmand) => {
  if (msg.guild && !msg.member.permissions.has('ADMINISTRATOR') && commmand && commmand.id !== 'commands') {
    const guildData = await guild(msg.guild.id)
    const result = guildData.data.disableChannels.includes(msg.channel.id)
    if (result) throw "blocked";
  }
}, {
  category: 'general',
  reason: 'disableCommands'
})