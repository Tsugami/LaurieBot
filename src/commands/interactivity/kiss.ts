import NeekoCommand from '../../utils/NeekoCommand'
import Neeko from '../../services/neko'

export default new NeekoCommand('kiss', ['beijar'], 
	(author, user) => `**${author.username}** Beijou **${user.username}**`,
	async () => {
		const res = await Neeko.sfw.kiss()
		return res.url
	})