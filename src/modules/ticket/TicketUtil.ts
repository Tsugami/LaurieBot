import { TICKET_EMOJIS } from '../../utils/Constants'
import { CategoryTypes } from '../../database/models/Guild'
import GuildController from '../../database/controllers/GuildController'
import Embed from '../../utils/Embed'
import { TextChannel, Message, Guild, ChannelData } from 'discord.js'

export const TicketNameRegex = /ticket-([0-9])/

export function isTicketEmoji (emoji: string): boolean {
  return emoji === TICKET_EMOJIS.QUESTION || emoji === TICKET_EMOJIS.REPORT || emoji === TICKET_EMOJIS.REVIEW
}

export function getCategoryByEmoji (emoji: string): CategoryTypes | null {
  if (emoji === TICKET_EMOJIS.QUESTION) return 'question'
  if (emoji === TICKET_EMOJIS.REPORT) return 'report'
  if (emoji === TICKET_EMOJIS.REVIEW) return 'review'
  return null
}

export async function createMainMessage(guild: Guild, channel: TextChannel, guildData: GuildController) {
  const channelData: ChannelData = {
    permissionOverwrites: [{
      id: guild,
      deny: ['SEND_MESSAGES', 'ADD_REACTIONS']
    }]
  }

  if (guildData.data.ticket && guildData.data.ticket.categoryId) {
    channelData.parent = guildData.data.ticket.categoryId
    channelData.position = 0
  }

  await channel.edit(channelData)

  const embed = new Embed(guild.client.user)
    .setAuthor('Ticket\'s')
    .setDescription('Descrição explicativa')
  if (guild.iconURL) embed.setThumbnail(guild.iconURL)

  const msg = await channel.send(embed)

  if (msg instanceof Message) {
    msg.react(TICKET_EMOJIS.QUESTION)
    msg.react(TICKET_EMOJIS.REPORT)
    msg.react(TICKET_EMOJIS.REVIEW)
    await guildData.updateTicket({ messageId: msg.id, channelId: channel.id })
  }
}