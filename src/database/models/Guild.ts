import { Schema, model, Document, Types } from 'mongoose';

const welcomeSchema = new Schema(
  {
    message: String,
    channelId: { type: String, required: true },
  },
  { id: false },
);

const ticketSchema = new Schema(
  {
    authorId: { required: true, type: String },
    channelId: { required: true, type: String },
    closed: Boolean,
    category: { required: true, type: String, enum: ['question', 'report', 'review'] },
    rate: String,
  },
  { timestamps: true },
);

const ticketConfigSchema = new Schema(
  {
    active: Boolean,
    categoryId: String,
    role: String,
    tickets: [ticketSchema],
  },
  { id: false },
);

const GuildSchema = new Schema({
  language: String,
  guildId: { type: String, required: true },
  disabledCommands: [String],
  disabledChannels: [String],
  penaltyChannel: String,
  ticket: ticketConfigSchema,
  welcome: welcomeSchema,
  wordFilter: [String],
});

export interface WelcomeModule {
  message?: string;
  channelId: string;
}

export type CategoryTypes = 'question' | 'report' | 'review';
export type RateTypes = 'good' | 'bad' | 'normal';

export interface Ticket {
  _id?: Types.ObjectId;
  authorId: string;
  channelId: string;
  category: CategoryTypes;
  closed?: boolean;
  rate?: RateTypes;
}

export interface TicketConfigModule {
  active: boolean;
  role?: string;
  categoryId?: string;
  tickets: Ticket[];
}

export interface GuildDocument extends Document {
  autoroleID?: string;
  language?: string;
  guildId: string;
  disabledChannels: string[];
  disabledCommands: string[];
  wordFilter: string[];
  penaltyChannel?: string | null;
  ticket?: TicketConfigModule;
  welcome: WelcomeModule | null;
}

export default model<GuildDocument>('guilds', GuildSchema);
