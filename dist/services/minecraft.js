"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _axios = require('axios'); var _axios2 = _interopRequireDefault(_axios);

const VISAGE = 'https://visage.surgeplay.com';
const MOJANG = 'https://api.mojang.com/users/profiles/minecraft/';

 const skin = (uuid) => `${VISAGE}/full/512/${uuid}.png`; exports.skin = skin;






 async function getUser(username) {
  const res = await _axios2.default.get(MOJANG + username);
  if (res.status !== 200) return Promise.reject();

  return {
    name: res.data.name,
    skin: exports.skin.call(void 0, res.data.id),
  };
} exports.getUser = getUser;








 async function getServer(address) {
  const [host, port = 25565] = address.split(':');

  const response = await _axios2.default.call(void 0, `https://mcapi.us/server/status?ip=${host}&port=${port}`);

  if (response.status !== 200 || response.data.status === 'error') throw new Error('not found');

  console.log(response);

  return {
    online: true,
    players: `${response.data.players.now}/${response.data.players.max}`,
    version: response.data.server.name.replace(/Requires MC/i, ''),
    address: `${host}:${port}`,
  };
} exports.getServer = getServer;

 function getAwardImage(title, text) {
  title = encodeURIComponent(title);
  text = encodeURIComponent(text);
  return `https://www.minecraftskinstealer.com/achievement/a.php?i=38&h=${title}&t=${text}`;
} exports.getAwardImage = getAwardImage;
