"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _NeekoCommand = require('@utils/NeekoCommand'); var _NeekoCommand2 = _interopRequireDefault(_NeekoCommand);
var _neko = require('@services/neko'); var _neko2 = _interopRequireDefault(_neko);

exports. default = new (0, _NeekoCommand2.default)('slap', ['bater'], 'commands:slap.message', async () => {
  const res = await _neko2.default.sfw.slap();
  return res.url;
});
