import { Listener } from 'discord-akairo';
import { Message } from 'discord.js'
import { guild } from '@database/index'
import { addUserList, isMainChannel } from '@ticket/TicketUtil'

export default class messageEvent extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      eventName: 'message',
    });
  }

  async exec(msg: Message) {
    if (msg.author.bot) return

    const guildData = await guild(msg.guild.id)

    addUserList(msg, guildData)
    if (isMainChannel(msg, guildData)) {
      return msg.delete()
    }
  }
}
