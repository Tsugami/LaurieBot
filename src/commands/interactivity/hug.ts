import NeekoCommand from '../../utils/NeekoCommand'
import Neeko from '../../services/neko'

export default new NeekoCommand('hug', ['abraçar'], 
	(author, user) => `**${author.username}** Abraçou **${user.username}**`,
	async () => {
		const res = await Neeko.sfw.hug()
		return res.url
	})