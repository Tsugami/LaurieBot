import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

import { Discord } from '../../categories';
import Embed from '../../utils/Embed';
import Text from '../../utils/Text';
import { Emojis } from '../../utils/Constants'
import { getDate } from '../../utils/Date';


class UserinfoCommand extends Command {
  constructor() {
    super('userinfo', {
      aliases: ['userinfo'],
      category: Discord,
      channelRestriction: 'guild',
      args: [
        {
          id: 'member',
          type: 'member',
          default: (msg: Message) => msg.member,
        },
      ],
    });
  }

  exec (msg: Message, { member }: { member: GuildMember }) {
    const { author, guild } = msg
    const user = member.user
    const text = new Text()


    let status: string
    let statusEmoji: Emojis
    switch (user.presence.status) {
      case "idle":
        status = 'Ausente'
       statusEmoji = Emojis.STATUS_AWAY
        break;
      case 'dnd':
        status = 'Ocupado'
       statusEmoji = Emojis.STATUS_BUSY
        break
      case 'online':
        status = 'Online'
       statusEmoji = Emojis.STATUS_ONLINE
        break
      case 'offline':
        status = 'Offline'
        statusEmoji = Emojis.STATUS_OFFLINE
        break
    }

    let playing: string = 'Jogando'
    let app: string = 'Nada'
    let appEmoji: Emojis = Emojis.VIDEO_GAME
    if (user.presence.game) {
      app = user.presence.game.name
      switch (user.presence.game.type) {
        case 1:
          playing = 'Streamando'
          appEmoji = Emojis.VIDEO_CAMERA
          break;
        case 2:
          playing = 'Ouvindo'
          appEmoji = Emojis.HEADPHONES
          break;
        case 3:
          playing = 'Assistindo'
          appEmoji = Emojis.TV
      }
    }


    const roles = member.roles
      .filter(role => role.id !== guild.id)
      .map(role => role.toString())
      .slice(0, 5)
      .join(', ')

    text.addTitle(Emojis.WALLET, `INFORMAÇÕES DE ${user.username.toUpperCase()}`)
    text.addField(Emojis.PERSON, 'Nome', user.tag)
    text.addField(Emojis.COMPUTER, 'ID', user.id)
    text.addField(statusEmoji, 'Status', status)
    text.addField(Emojis.CALENDER, 'Criado em', getDate(user.createdAt))
    text.addField(Emojis.INBOX, 'Entrou em', getDate(member.joinedAt))
    text.addField(appEmoji, playing, app)
    text.addField(Emojis.BRIEFCASE, 'Cargos', roles || 'Nenhum')

    const embed = new Embed(author)
      .setAuthor(user.username, user.displayAvatarURL)
      .setDescription(text)
      .setThumbnail(user.displayAvatarURL)
    msg.reply(embed);
  }
}

export default UserinfoCommand;
