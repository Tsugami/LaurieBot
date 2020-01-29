"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _tsconfigjson = require('../../tsconfig.json'); var _tsconfigjson2 = _interopRequireDefault(_tsconfigjson);
var _modulealias = require('module-alias'); var _modulealias2 = _interopRequireDefault(_modulealias);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

const alias = _tsconfigjson2.default.compilerOptions.paths;

const mainFolder = __filename.endsWith('ts') ? 'src' : 'dist'

Object.entries(alias).forEach((x) => {
  const dirPath = x[1].shift()
  if (dirPath) {
    _modulealias2.default.addAlias(x[0].replace('/*', ''), _path2.default.resolve(mainFolder + '/' + dirPath).replace('/*', ''))
  }
})

_modulealias2.default.call(void 0, )