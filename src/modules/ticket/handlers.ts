import { Message, TextChannel, CategoryChannel , Role, ChannelCreationOverwrites } from 'discord.js';
import { guild } from '@database/index';
import { setupMainChannel } from './'
import deleteAll from './deleteAllHandler'

export async function activateHandler(msg: Message, mainChannel: TextChannel, category?: CategoryChannel, role?: Role) {
  const guildData = await guild(msg.guild.id)
  const ticket = guildData.data.ticket

  if (ticket && ticket.active) {
    return msg.reply('os ticket\'s já estão ativos.')
  }
  try {
    await setupMainChannel(msg.guild, mainChannel, guildData, category, role)
    return msg.reply('os  ticket\'s foram ativados nesse canal.')
  } catch (error) {
    console.error(error)
    return msg.reply('Não foi possivel ativar os ticket\'s')
  }
}


export async function deactivateHandler(msg: Message) {
  const guildData = await guild(msg.guild.id)
  const ticket = guildData.data.ticket

  if (!ticket || !ticket.active) {
    return msg.reply('os ticket\'s já estão desativado.')
  }

  await deleteAll(guildData, msg.guild)
  return msg.reply('os  ticket\'s foram desativados nesse canal.')
}

export async function changeMainChannelHandler(msg: Message, newChannel: TextChannel) {
  const guildData = await guild(msg.guild.id)
  const ticket = guildData.data.ticket

  if (!ticket || !ticket.active) {
    return msg.reply('não é possivel alterar o canal com os ticket\'s estão desativados.')
  }
  const oldId = ticket.channelId
  const oldChannel = msg.guild.channels.get(ticket.channelId)
  if (oldId === newChannel.id) {
    return msg.reply(`o canal ${newChannel.toString()} já está definido como canal principal.`)
  }

  if (oldChannel && ticket.messageId && oldChannel instanceof TextChannel) {
    const msg = await oldChannel.fetchMessage(ticket.messageId).catch(() => null)
    if (msg) msg.delete()
  }

  await setupMainChannel(msg.guild, newChannel, guildData)
  return msg.reply(`canal de ticket's alterado. ${oldChannel ? oldChannel.toString() : oldId} **>>>** ${newChannel.toString()}`)
}

export async function changeCategoryHandler(msg: Message, category: CategoryChannel) {
  const guildData = await guild(msg.guild.id)
  const ticket = guildData.data.ticket

  if (!ticket || !ticket.active) {
    return msg.reply('não é possivel alterar o canal com os ticket\'s estão desativados.')
  }
  const oldId = ticket.categoryId
  if (oldId && oldId === category.id) {
    return msg.reply(`a categoria **${category.name}** já está definido como categoria de ticket's.`)
  }

  await guildData.updateTicket({ categoryId: category.id, channelId: ticket.channelId })

  if (ticket.channelId) {
    const channel = msg.guild.channels.get(ticket.channelId)
    if (channel) channel.setParent(category)
  }
  let text: string
  if (oldId) {
    const oldCategory = msg.guild.channels.get(oldId)
    text = `categoria de ticket's alterada. ${oldCategory ? oldCategory.name.toUpperCase() : oldId} **>>>** ${category.name.toUpperCase()}`
  } else {
    text = `categoria de ticket's setada para **${category.name.toUpperCase()}**.`
  }


  // change ticket channels
  if (ticket && ticket.tickets) {
    for (const tk of ticket.tickets) {
      const channel = msg.guild.channels.get(tk.channelId)
      if (channel) {
        channel.setParent(category)
      }
    }
  }

  msg.reply(text)
}

export async function changeRoleChange (msg: Message, role: Role) {
  const guildData = await guild(msg.guild.id)
  const ticket = guildData.data.ticket

  if (!ticket || !ticket.active) {
    return msg.reply('não é possivel alterar o cargo com os ticket\'s estão desativados.')
  }
  const oldId = ticket.role
  const oldRole =  oldId && msg.guild.roles.get(oldId)
  if (oldId && oldId === role.id) {
    return msg.reply(`a cargo **${role.name}** já está definido como cargo de suporte dos ticket's.`)
  }

  await guildData.updateTicket({ role: role.id, channelId: ticket.channelId })

  let text: string
  if (oldId) {
    text = `cargo de ticket's alterada. ${oldRole ? oldRole.name.toUpperCase() : oldId} **>>>** ${role.name.toUpperCase()}`
  } else {
    text = `cargo de ticket's setada para **${role.name.toUpperCase()}**.`
  }

  msg.reply(text)

  if (ticket && ticket.tickets) {
    for (const tk of ticket.tickets) {
      const channel = msg.guild.channels.get(tk.channelId)
      if (channel) {
        const dataOverwrites: ChannelCreationOverwrites[] = [{
          id: role,
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

