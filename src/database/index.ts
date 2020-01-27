import GuildController from './controllers/GuildController';
import Guild, { GuildDocument } from './models/Guild';

const guilds = new Map<string, GuildController>();

// export async function getDocument<
//   Controller extends Base<Doc>,
//   Doc extends Document,
//   Key
//   >(data: Key, model: Model<Doc>, Controller: Controller, map: Map<Key, Controller>): Promise<Controller> {
//   const docCache = map.get(data)
//   if (docCache) return docCache
//   const findDoc = await model.findOne(data)
//   if (findDoc) {
//     const result = Controller
//   }
//   const createdDoc = await model.create(data)

// }

export function addGuild(guildId: string, data: GuildDocument): GuildController {
  const guildData = new GuildController(data);
  guilds.set(guildId, guildData);
  return guildData;
}
export async function guild(guildId: string): Promise<GuildController> {
  const docCache = guilds.get(guildId);
  if (docCache) return docCache;
  const findDoc = await Guild.findOne({ guildId });
  if (findDoc) return addGuild(guildId, findDoc);
  const createdDoc = await Guild.create({ guildId });
  return addGuild(guildId, createdDoc);
}
