import 'dotenv/config';
import './config/alias';
import mongoose from 'mongoose';
import http from 'http';
import LaurieClient from './client/LaurieClient';

const client = new LaurieClient();
const server = http.createServer((_, res) => {
  res.writeHead(200);
  res.end();
});

mongoose.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.start(String(process.env.BOT_TOKEN));
server.listen(process.env.PORT || 3333);

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
