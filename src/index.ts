import './types';
import 'dotenv/config';
import './config/alias';
import './glitch/autoping';
import LaurieClient from './client/LaurieClient';

const client = new LaurieClient();

client.start(String(process.env.BOT_TOKEN));
