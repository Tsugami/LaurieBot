import 'dotenv/config';
import './config/alias';
import './glitch/autoping';
import mongoose from 'mongoose';

import LaurieClient from './client/LaurieClient';

const client = new LaurieClient();

mongoose.connect(String(process.env.MONGO_URI), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.start(String(process.env.BOT_TOKEN));
