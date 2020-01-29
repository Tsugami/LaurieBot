"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _moment = require('moment'); var _moment2 = _interopRequireDefault(_moment);

_moment2.default.locale('pt-br');

 function getDate(timestamp) {
  return _moment2.default.call(void 0, timestamp).format('LLL');
} exports.getDate = getDate;
