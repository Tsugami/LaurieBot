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
    users: [String],
    rating: { type: Number, max: 10, min: 0 },
    closed: Boolean,
    category: { required: true, type: String, enum: ['question', 'report', 'review'] },
    closedAt: Date,
    closedBy: String,
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
  guildId: { type: String, required: true },
  disableChannels: [String],
  penaltyChannels: [String],
  ticket: ticketConfigSchema,
  welcome: welcomeSchema,
});

export interface WelcomeModule {
  message?: string;
  channelId: string;
}

export type CategoryTypes = 'question' | 'report' | 'review';

export interface Ticket {
  _id?: Types.ObjectId;
  authorId: string;
  channelId: string;
  category: CategoryTypes;
  users?: string[];
  rating?: number;
  closedAt?: Date;
  closedBy?: string;
  closed?: boolean;
  createdAt?: Date;
}

export interface TicketConfigModule {
  active: boolean;
  role?: string;
  categoryId?: string;
  tickets: Ticket[];
}

export interface GuildDocument extends Document {
  guildId: string;
  disableChannels: string[];
  penaltyChannels: string[];
  ticket?: TicketConfigModule;
  welcome: WelcomeModule | null;
}

export default model<GuildDocument>('guilds', GuildSchema);
