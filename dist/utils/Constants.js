"use strict";Object.defineProperty(exports, "__esModule", {value: true});

 const EMBED_DEFAULT_COLOR = '#ff8c08'; exports.EMBED_DEFAULT_COLOR = EMBED_DEFAULT_COLOR;
 const MUTE_ROLE_NAME = 'Mutado'; exports.MUTE_ROLE_NAME = MUTE_ROLE_NAME;
 const ASSET_BASE_PATH = 'https://storage.googleapis.com/data-sunlight-146313.appspot.com'; exports.ASSET_BASE_PATH = ASSET_BASE_PATH;
var Emojis; (function (Emojis) {
  const FOLDER = '📁'; Emojis["FOLDER"] = FOLDER;
  const CROWN = '👑'; Emojis["CROWN"] = CROWN;
  const COMPUTER = '💻'; Emojis["COMPUTER"] = COMPUTER;
  const CALENDER = '📆'; Emojis["CALENDER"] = CALENDER;
  const PERSON = '👤'; Emojis["PERSON"] = PERSON;
  const PERSONS = '👥'; Emojis["PERSONS"] = PERSONS;
  const ROBOT = '🤖'; Emojis["ROBOT"] = ROBOT;
  const STRONKS = '📈'; Emojis["STRONKS"] = STRONKS;
  const NOT_STRONKS = '📉'; Emojis["NOT_STRONKS"] = NOT_STRONKS;
  const TICKET = '🎫'; Emojis["TICKET"] = TICKET;
  const EARTH = '🌍'; Emojis["EARTH"] = EARTH;
  const INBOX = '📥'; Emojis["INBOX"] = INBOX;
  const UNKNOWN = '❓'; Emojis["UNKNOWN"] = UNKNOWN;
  const TV = '📺'; Emojis["TV"] = TV;
  const VIDEO_GAME = '🎮'; Emojis["VIDEO_GAME"] = VIDEO_GAME;
  const HEADPHONES = '🎧'; Emojis["HEADPHONES"] = HEADPHONES;
  const UNLOCK = '🔓'; Emojis["UNLOCK"] = UNLOCK;
  const LOCK = '🔒'; Emojis["LOCK"] = LOCK;
  const VIDEO_CAMERA = '📹'; Emojis["VIDEO_CAMERA"] = VIDEO_CAMERA;
  const BRIEFCASE = '💼'; Emojis["BRIEFCASE"] = BRIEFCASE;
  const PINCHING_HAND = '🤏'; Emojis["PINCHING_HAND"] = PINCHING_HAND;
  const JOIA = '👍'; Emojis["JOIA"] = JOIA;
  const LUL = '🤪'; Emojis["LUL"] = LUL;
  const DOOR = '🚪'; Emojis["DOOR"] = DOOR;
  const OX = '🐂'; Emojis["OX"] = OX;
  const LABEL = '🏷️'; Emojis["LABEL"] = LABEL;
  const SHIELD = '🛡️'; Emojis["SHIELD"] = SHIELD;
  const KEYBOARD = '⌨️'; Emojis["KEYBOARD"] = KEYBOARD;
  const MAN_JUDGE = '👨‍⚖️'; Emojis["MAN_JUDGE"] = MAN_JUDGE;
  const BALLOT_BOX = '🗳️'; Emojis["BALLOT_BOX"] = BALLOT_BOX;
  const PAGE = '📄'; Emojis["PAGE"] = PAGE;
  const SCALES = '⚖️'; Emojis["SCALES"] = SCALES;
  const CAP = '🧢'; Emojis["CAP"] = CAP;
  const CARD_INDEX = '📇'; Emojis["CARD_INDEX"] = CARD_INDEX;
  const SPEECH_BALLON = '💬'; Emojis["SPEECH_BALLON"] = SPEECH_BALLON;
  const RED_TICKET = '🎟️'; Emojis["RED_TICKET"] = RED_TICKET;
  const ANUNCIAR = '<a:anunciar:671077734566461440>'; Emojis["ANUNCIAR"] = ANUNCIAR;
  const STATUS_ONLINE = '<:online:669594447251636226>'; Emojis["STATUS_ONLINE"] = STATUS_ONLINE;
  const STATUS_OFFLINE = '<:offline:669594447138258964>'; Emojis["STATUS_OFFLINE"] = STATUS_OFFLINE;
  const STATUS_BUSY = '<:ocupado:669594449440931846>'; Emojis["STATUS_BUSY"] = STATUS_BUSY;
  const STATUS_AWAY = '<:ausente:669594447108898821>'; Emojis["STATUS_AWAY"] = STATUS_AWAY;
  const WALLET = '<:identidade:669615608622481441>'; Emojis["WALLET"] = WALLET;
  const JAVA = '<:java:669685001205448716>'; Emojis["JAVA"] = JAVA;
  const PLACA_MINECRAFT = '<:info:669682580693712907>'; Emojis["PLACA_MINECRAFT"] = PLACA_MINECRAFT;
})(Emojis || (exports.Emojis = Emojis = {}));

 const TICKET_EMOJIS = {
  REVIEW: Emojis.LABEL,
  REPORT: Emojis.RED_TICKET,
  QUESTION: Emojis.TICKET,
}; exports.TICKET_EMOJIS = TICKET_EMOJIS;

 const STATUS_EMOJIS = {
  offline: Emojis.STATUS_OFFLINE,
  online: Emojis.STATUS_ONLINE,
  dnd: Emojis.STATUS_BUSY,
  idle: Emojis.STATUS_AWAY,
}; exports.STATUS_EMOJIS = STATUS_EMOJIS;

 const PLAYING_EMOJIS = [Emojis.VIDEO_GAME, Emojis.VIDEO_CAMERA, Emojis.HEADPHONES, Emojis.TV]; exports.PLAYING_EMOJIS = PLAYING_EMOJIS;
