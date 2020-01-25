import 'dotenv/config'

import { AkairoClient } from 'discord-akairo'
import mongoose from 'mongoose'

const client = new AkairoClient({
	listenerDirectory: 'src/events',
	commandDirectory: 'src/commands',
	inhibitorDirectory: 'src/inhibitors',
	prefix: process.env.BOT_PREFIX || '!'
}, {});

mongoose.connect(String(process.env.MONGO_URI), {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
client.login(String(process.env.BOT_TOKEN))