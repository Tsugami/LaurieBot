import Backend from 'i18next-node-fs-backend';
import i18next from 'i18next';
import { join } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import logger from './logger';

export function getFixedT(language = 'pt-BR') {
  return i18next.getFixedT(language);
}

export function exists(tPath: string) {
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
