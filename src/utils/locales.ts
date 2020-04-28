import Backend from 'i18next-node-fs-backend';
import i18next, { TFunction } from 'i18next';
import { resolve } from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { Message, Guild } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
import logger from './logger';

export { TFunction } from 'i18next';

export default class Locales {
  static fallbackLng = 'pt-BR';

  static async getFixedT(resolveLang: string | Message | Guild = this.fallbackLng): Promise<TFunction> {
    let guild: Guild | null = null;
    let language = this.fallbackLng;

    if (resolveLang instanceof Message && resolveLang.guild) {
      guild = resolveLang.guild;
    } else if (resolveLang instanceof Guild) {
      guild = resolveLang;
    }

    if (guild) {
      const guildData = await (guild.client as AkairoClient).database.getGuild(guild.id);
      if (guildData.data.language) language = guildData.data.language;
    }

    return i18next.getFixedT(language);
  }

  static exists(tPath: string | string[]) {
    return i18next.exists(tPath);
  }

  static async loadAll() {
    const readdir = promisify(fs.readdir);
    const pathFolder = resolve(__dirname, '..', '..', 'locales');

    return i18next.use(Backend).init(
      {
        ns: ['categories', 'commands', 'commons', 'errors', 'permissions', 'modules'],
        preload: await readdir(pathFolder),
        fallbackLng: this.fallbackLng,
        load: 'currentOnly',
        backend: {
          loadPath: `${pathFolder}/{{lng}}/{{ns}}.yml`,
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

  static get languages(): string[] {
    return i18next.options.preload || [this.fallbackLng];
  }
}
