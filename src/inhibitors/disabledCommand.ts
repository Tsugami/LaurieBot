import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import LaurieCommand from '../structures/LaurieCommand';

export default class DisabledCommand extends Inhibitor {
  constructor() {
    super('disabledCommand', {
      reason: 'disabledCommand',
    });
  }

  async exec(msg: Message, command: LaurieCommand) {
    if (!msg.guild || !command) return false;
    const guildData = await this.client.database.getGuild(msg.guild.id);
    return guildData.disabledCommands.includes(command.id);
  }
}
