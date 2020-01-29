import 'dotenv/config';
import './config/alias';
import Client from '@struct/Client';
import mongoose from 'mongoose';

const client = new Client();

mongoose.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.login(String(process.env.BOT_TOKEN));
