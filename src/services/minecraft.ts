import axios from 'axios';

const VISAGE = 'https://visage.surgeplay.com';
const MOJANG = 'https://api.mojang.com/users/profiles/minecraft/';

export const skin = (uuid: string) => `${VISAGE}/full/512/${uuid}.png`;

interface MCUserI {
  name: string;
  skin: string;
}

export async function getUser(username: string): Promise<MCUserI> {
  const res = await axios.get(MOJANG + username);
  if (res.status !== 200) return Promise.reject();

  return {
    name: res.data.name,
    skin: skin(res.data.id),
  };
}

interface MCServerI {
  online: boolean;
  players: string;
  version: string;
  address: string;
}

export async function getServer(address: string): Promise<MCServerI> {
  const [host, port = 25565] = address.split(':');

  const response = await axios(`https://mcapi.us/server/status?ip=${host}&port=${port}`);

  return {
    online: true,
    players: `${response.data.players.now}/${response.data.players.max}`,
    version: response.data.server.name.replace(/Requires MC/i, ''),
    address: `${host}:${port}`,
  };
}

export function getAwardImage(title: string, text: string) {
  title = encodeURIComponent(title);
  text = encodeURIComponent(text);
  return `https://www.minecraftskinstealer.com/achievement/a.php?i=38&h=${title}&t=${text}`;
}
