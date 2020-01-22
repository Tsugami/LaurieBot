import 'dotenv/config'

import { AkairoClient } from 'discord-akairo'

const client = new AkairoClient({
	listenerDirectory: 'src/events',
	commandDirectory: 'src/commands',
	prefix: process.env.BOT_PREFIX || '!'
});

client.login(process.env.BOT_TOKEN)