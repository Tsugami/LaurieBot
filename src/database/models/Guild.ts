import { Schema, model, Document, Types } from 'mongoose'

const welcomeSchema = new Schema({
	message: String,
	active: Boolean,
	channelId: { type: String, required: true }
}, { id: false })


const ticketSchema = new Schema({
  authorId: { required: true, type: String },
  channelId: { required: true, type: String },
  users: [String],
  rating: { type: Number, max: 10, min: 0 },
  closed: Date,
}, { timestamps: true })

const ticketConfigSchema = new Schema({
  message: String,
  active: Boolean,
  channelId: { type: String, required: true }, // main channel
  categoryId: String,
  role: String,
  messageId: String,
  tickets: [ticketSchema],
}, { id: false })

const GuildSchema = new Schema({
	guildId: { type: String, required: true },
	disableChannels: [String],
	penaltyChannels: [String],
  ticket: ticketConfigSchema,
	welcome: [welcomeSchema]
})

export interface WelcomeModule {
	active?: boolean
	message?: string
	channelId: string
}

export interface Ticket {
  _id: Types.ObjectId,
  channelId: String,
  users?: string[],
  rating?: number,
  closed?: Date,
}

export interface TicketConfigModule extends WelcomeModule {
	categoryId?: string
  role?: string,
  messageId?: string
  tickets?: Ticket[]
}

export interface GuildDocument extends Document {
	guildId: string;
	disableChannels: string[],
	penaltyChannels: string[],
	ticket: TicketConfigModule,
	welcome: WelcomeModule[]
}

export default model<GuildDocument>('guilds', GuildSchema)