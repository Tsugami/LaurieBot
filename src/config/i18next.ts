import Backend from 'i18next-node-fs-backend';
import i18next from 'i18next';
import path from 'path';
import fs from 'fs';

import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const pathFolder = path.resolve('src', 'locales');

async function loadi18n() {
  i18next.use(Backend).init(
    {
      ns: ['categories', 'commands'],
      preload: await readdir(pathFolder),
      fallbackLng: 'pt-BR',
      load: 'currentOnly',
      backend: {
        loadPath: `src/locales/{{lng}}/{{ns}}.yml`,
      },
      interpolation: { escapeValue: false },
      returnEmptyString: false,
    },
    (error, t) => {
      if (error) {
        console.error(error);
      }
    },
  );
}

loadi18n();
