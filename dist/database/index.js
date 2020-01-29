"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _GuildController = require('./controllers/GuildController'); var _GuildController2 = _interopRequireDefault(_GuildController);
var _Guild = require('./models/Guild'); var _Guild2 = _interopRequireDefault(_Guild);

const guilds = new Map();

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

 function addGuild(guildId, data) {
  const guildData = new (0, _GuildController2.default)(data);
  guilds.set(guildId, guildData);
  return guildData;
} exports.addGuild = addGuild;
 async function guild(guildId) {
  const docCache = guilds.get(guildId);
  if (docCache) return docCache;
  const findDoc = await _Guild2.default.findOne({ guildId });
  if (findDoc) return addGuild(guildId, findDoc);
  const createdDoc = await _Guild2.default.create({ guildId });
  return addGuild(guildId, createdDoc);
} exports.guild = guild;
