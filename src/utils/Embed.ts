import { RichEmbed, User } from 'discord.js'
import { EMBED_DEFAULT_COLOR } from './Constants'


export default class Embed extends RichEmbed {
	constructor (author: User) {
		super()
		this.setFooter(`Por ${author.username}`, author.displayAvatarURL)
		this.setColor(EMBED_DEFAULT_COLOR)
		this.setTimestamp()
	}
}
