import NeekoCommand from '../../utils/NeekoCommand'
import Neeko from '../../services/neko'

export default new NeekoCommand('slap', ['bater'], 
	(author, user) => `**${author.username}** bateu em **${user.username}**`,
	async () => {
		const res = await Neeko.sfw.slap()
		return res.url
	})