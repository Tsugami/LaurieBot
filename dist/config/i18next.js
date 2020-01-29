"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _i18nextnodefsbackend = require('i18next-node-fs-backend'); var _i18nextnodefsbackend2 = _interopRequireDefault(_i18nextnodefsbackend);
var _i18next = require('i18next'); var _i18next2 = _interopRequireDefault(_i18next);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);

var _util = require('util');

const readdir = _util.promisify.call(void 0, _fs2.default.readdir);
const pathFolder = _path2.default.resolve('src', 'locales');

 async function buildi18n() {
  return _i18next2.default.use(_i18nextnodefsbackend2.default).init(
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
        console.error(error);
      }
    },
  );
} exports.buildi18n = buildi18n;
