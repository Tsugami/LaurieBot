import 'dotenv/config';
import './config/alias';
import Client from '@struct/Client';
import mongoose from 'mongoose';
import { createServer } from 'http';

const client = new Client();
const server = createServer((_, res) => {
  res.writeHead(200);
  res.end();
});

mongoose.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.login(String(process.env.BOT_TOKEN));
server.listen(process.env.PORT || 3333);
