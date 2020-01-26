import { TICKET_EMOJIS, Emojis } from '@utils/Constants'
import { CategoryTypes, Ticket } from '@database/models/Guild'
import { guild } from '@database/index'
import GuildController from '@database/controllers/GuildController'
import Embed from '@utils/Embed'
import { TextChannel, Message, Guild, ChannelData } from 'discord.js'
import { ArgumentTypeFunction } from 'discord-akairo';


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

export function getEmojiByCategory (category: CategoryTypes): Emojis {
  if (category === 'question') return TICKET_EMOJIS.QUESTION
  else if (category === 'report') return TICKET_EMOJIS.REPORT
  else return TICKET_EMOJIS.REVIEW
}

export async function addUserList (msg: Message, guildData: GuildController) {
  const ticketData = guildData.data.ticket

  if (ticketData && ticketData.active && ticketData.tickets && ticketData.tickets.length) {
    const tickets = ticketData.tickets
    const ticket = tickets.find(x => x.channelId === msg.channel.id && !x.closed)
    if (ticket) {
      const users = ticket.users || []
      if (!users.includes(msg.author.id)) {
        guildData.updateTickets({
          channelId: ticket.channelId,
          authorId: ticket.authorId,
          category: ticket.category,
          users
        })
      }
    }
  }
}

export function isMainChannel (msg: Message, guildData: GuildController) {
  return guildData.data.ticket && guildData.data.ticket.active && (msg.channel.id === guildData.data.ticket.channelId)
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

type goodResult = { ticket: Ticket, guildData: GuildController }
type X = 'desabilidado' | 'no-tickets' | 'user-no-ticket' |'user-no-perm' | goodResult
type B = X | 'all-closed'
export type TicketArgType = B
type handlerT = (x: string) => ArgumentTypeFunction
export async function findTicketTypeArg<T> (w: string, msg: Message, args: T, argsHandler: handlerT, checkIfAllClosed: boolean = true): Promise<TicketArgType> {
  const guildData = await guild(msg.guild.id)
  const ticketData = guildData.data.ticket

  if (!ticketData || !ticketData.active) return 'desabilidado'
  if (!ticketData.tickets || ticketData.tickets.length === 0) return 'no-tickets'

  // check if exists ticket open
  if (checkIfAllClosed) {
    const allClosed = ticketData.tickets.every(x => x.closed)
    if (allClosed) return 'all-closed'
  }

  const hasRole = () => ticketData.role &&  msg.member.roles.has(ticketData.role)
  const hasPermission = () => !msg.member.permissions.has('ADMINISTRATOR') || hasRole()

  if (!w) {
    // check if channel is ticket channel
    const ticketChannel = ticketData.tickets.find(x => x.channelId === msg.channel.id)
    if (ticketChannel) {
      return { ticket: ticketChannel, guildData }
    }
    // check if user has ticket open
    const userTicket = ticketData.tickets.find(x => x.authorId === msg.author.id && !x.closed)
    if (userTicket) {
      return { ticket: userTicket, guildData }
    }
    // check if user has permission to manager ticket's
    if (hasPermission()) {
      return 'user-no-ticket'
    } else {
      return Promise.reject()
    }
  } else {
    if (hasPermission()) return 'user-no-perm'
    const handler = (x: string) => {
      let r
      try {
        r = argsHandler(x)
      } catch(_) {

      }
      if (r) return r(w, msg, args)
    }
    // check if that's user
    const channel = handler('textChannel')
    if (channel) {
      const find =  ticketData.tickets.find(x => x.channelId === channel.id)
      if (find) return {ticket: find, guildData }
      else return Promise.reject()
    }
    // check if that's user
    const member = handler('member')
    if (member) {
      const find =  ticketData.tickets.find(x => x.authorId === member.user.id && !x.closed)
      if (find) return { ticket: find, guildData }
      else return Promise.reject()
    }
    // check if that's ticket id
    const find = ticketData.tickets.find(x => x._id && x._id.equals(w))
    if (find) {
      return { ticket: find, guildData }
    }

    return Promise.reject()
  }
}