import 'dotenv/config';
import 'tsconfig-paths/register';

import Client from '@struct/Client';
import mongoose from 'mongoose';

const client = new Client();

mongoose.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.login(String(process.env.BOT_TOKEN));
