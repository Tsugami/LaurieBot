"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');

const welcomeSchema = new (0, _mongoose.Schema)(
  {
    message: String,
    channelId: { type: String, required: true },
  },
  { id: false },
);

const ticketSchema = new (0, _mongoose.Schema)(
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

const ticketConfigSchema = new (0, _mongoose.Schema)(
  {
    message: String,
    active: Boolean,
    channelId: { type: String, required: true }, // main channel
    categoryId: String,
    role: String,
    messageId: String,
    tickets: [ticketSchema],
  },
  { id: false },
);

const GuildSchema = new (0, _mongoose.Schema)({
  guildId: { type: String, required: true },
  disableChannels: [String],
  penaltyChannels: [String],
  ticket: ticketConfigSchema,
  welcome: welcomeSchema,
});







































exports. default = _mongoose.model('guilds', GuildSchema);
