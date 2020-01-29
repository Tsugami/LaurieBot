"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
require('./config/alias');
var _Client = require('@struct/Client'); var _Client2 = _interopRequireDefault(_Client);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

const client = new (0, _Client2.default)();

_mongoose2.default.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.login(String(process.env.BOT_TOKEN));
