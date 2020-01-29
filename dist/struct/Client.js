"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _i18next = require('@config/i18next');
var _discordakairo = require('discord-akairo');
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

const mainFolder = __filename.endsWith('ts') ? 'src' : 'dist';

 class Client extends _discordakairo.AkairoClient {
  constructor() {
    super(
      {
        listenerDirectory: _path2.default.resolve(mainFolder, 'events'),
        commandDirectory: _path2.default.resolve(mainFolder, 'commands'),
        inhibitorDirectory: _path2.default.resolve(mainFolder, 'inhibitors'),
        prefix: process.env.BOT_PREFIX || '!',
      },
      {},
    );
  }

  async login(token) {
    await _i18next.buildi18n.call(void 0, );
    return super.login(token);
  }
} exports.default = Client;
