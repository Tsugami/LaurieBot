import { Schema, model, Document } from 'mongoose'

const welcomeSchema = new Schema({
	message: String,
	active: Boolean,
	channelId: { type: String, required: true }
}, { id: false })

const ticketSchema = new Schema({
	message: String,
	active: Boolean,
	channelId: { type: String, required: true }, // main channel
	categoryId: String,
	role: String
}, { id: false })

const GuildSchema = new Schema({
	guildId: { type: String, required: true },
	disableChannels: [String],
	penaltyChannels: [String],
	ticket: ticketSchema,
	welcome: [welcomeSchema]
})

export interface WelcomeModule {
	active?: boolean
	message?: string
	channelId: string
}

export interface TicketModule extends WelcomeModule {
	categoryId?: string
	role?: string
}

export interface GuildDocument extends Document {
	guildId: string;
	disableChannels: string[],
	penaltyChannels: string[],
	ticket: TicketModule,
	welcome: WelcomeModule[]
}

export default model<GuildDocument>('guilds', GuildSchema)