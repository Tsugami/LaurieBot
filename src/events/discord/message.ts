import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { guild } from '@database/index';
import { addUserList, isMainChannel } from '@ticket/TicketUtil';

export default class MessageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      eventName: 'message',
    });
  }

  async exec(msg: Message) {
    if (msg.guild) {
      const guildData = await guild(msg.guild.id);

      if (!msg.author.bot) addUserList(msg, guildData);
      if (isMainChannel(msg, guildData)) {
        msg.delete();
      }
    }
  }
}
