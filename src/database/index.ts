import QuickIru from 'quick-lru';
import mongoose from 'mongoose';
import GuildController from './controllers/GuildController';
import Guild from './models/Guild';

export default class Database {
  guildCache = new QuickIru<string, GuildController>({ maxSize: 100 });

  init() {
    return mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async getGuild(guildId: string): Promise<GuildController> {
    if (this.guildCache.has(guildId)) {
      return this.guildCache.get(guildId) as GuildController;
    }

    const guild = await Guild.findOne({ guildId });
    if (guild) {
      const guildData = new GuildController(guild);
      this.guildCache.set(guildId, guildData);
      return guildData;
    }
    return this.createGuild(guildId);
  }

  async createGuild(guildId: string) {
    const guild = new GuildController(await Guild.create({ guildId }));
    this.guildCache.set(guildId, guild);
    return guild;
  }

  deleteGuild(guildId: string) {
    this.guildCache.delete(guildId);
    Guild.deleteOne({ guildId });
  }
}
