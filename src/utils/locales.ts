import Backend from 'i18next-node-fs-backend';
import i18next from 'i18next';
import { join } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Message, Guild } from 'discord.js';
import logger from './logger';

export { TFunction } from 'i18next';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFixedT(resolve: string | Message | Guild = 'pt-BR') {
  return i18next.getFixedT('pt-BR');
}

export function exists(tPath: string | string[]) {
  return i18next.exists(tPath);
}

export async function loadAll() {
  const readdir = promisify(fs.readdir);
  const pathFolder = join(__dirname, '..', 'locales');
  return i18next.use(Backend).init(
    {
      ns: ['categories', 'commands', 'commons', 'errors', 'permissions', 'modules'],
      preload: await readdir(pathFolder),
      fallbackLng: 'pt-BR',
      load: 'currentOnly',
      backend: {
        loadPath: `src/locales/{{lng}}/{{ns}}.yml`,
      },
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    },
    error => {
      if (error) {
        logger.error(error);
        process.exit(0);
      }
    },
  );
}
