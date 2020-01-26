import { Listener } from 'discord-akairo';
import { Guild, Role, ChannelCreationOverwrites } from 'discord.js'
import GuildController from '../../database/controllers/GuildController'

export default class TicketRoleChangedListener extends Listener {
  constructor() {
    super('ticketRoleChanged', {
      emitter: 'client',
      eventName: 'ticketRoleChanged',
    });
  }

  async exec(guildData: GuildController, guild: Guild, oldRole: Role | null, newRole: Role) {
    const data = guildData.data.ticket

    if (data && data.tickets) {
      for (const tk of data.tickets) {
        const channel = guild.channels.get(tk.channelId)
        if (channel) {
          const dataOverwrites: ChannelCreationOverwrites[] = [{
            id: newRole,
            allow: 'VIEW_CHANNEL'
          }]

          if (oldRole) {
            dataOverwrites.push({
              id: oldRole,
              deny: 'VIEW_CHANNEL'
            })
          }

          channel.edit({ permissionOverwrites: dataOverwrites })
        }
      }
    }
  }
}
