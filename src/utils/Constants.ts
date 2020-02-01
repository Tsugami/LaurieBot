import { PresenceStatusData } from 'discord.js';

export const CUSTOM_STATUS = 'Custom Status';
export const EMBED_DEFAULT_COLOR = '#ff8c08';
export const MUTE_ROLE_NAME = 'Mutado';
export const ASSET_BASE_PATH = 'https://storage.googleapis.com/data-sunlight-146313.appspot.com';
export enum Emojis {
  FOLDER = '📁',
  CROWN = '👑',
  COMPUTER = '💻',
  CALENDER = '📆',
  PERSON = '👤',
  PERSONS = '👥',
  ROBOT = '🤖',
  STRONKS = '📈',
  NOT_STRONKS = '📉',
  TICKET = '🎫',
  EARTH = '🌍',
  INBOX = '📥',
  UNKNOWN = '❓',
  TV = '📺',
  VIDEO_GAME = '🎮',
  HEADPHONES = '🎧',
  UNLOCK = '🔓',
  LOCK = '🔒',
  VIDEO_CAMERA = '📹',
  BRIEFCASE = '💼',
  PINCHING_HAND = '🤏',
  JOIA = '👍',
  LUL = '🤪',
  DOOR = '🚪',
  OX = '🐂',
  LABEL = '🏷️',
  SHIELD = '🛡️',
  KEYBOARD = '⌨️',
  MAN_JUDGE = '👨‍⚖️',
  BALLOT_BOX = '🗳️',
  PAGE = '📄',
  SCALES = '⚖️',
  CAP = '🧢',
  CARD_INDEX = '📇',
  SPEECH_BALLON = '💬',
  RED_TICKET = '🎟️',
  RTT = '🔂',
  HEARTBEAT = '💟',
  PING_PONG = '🏓',
  ANUNCIAR = '<a:anunciar:671077734566461440>',
  STATUS_ONLINE = '<:online:669594447251636226>',
  STATUS_OFFLINE = '<:offline:669594447138258964>',
  STATUS_BUSY = '<:ocupado:669594449440931846>',
  STATUS_AWAY = '<:ausente:669594447108898821>',
  WALLET = '<:identidade:669615608622481441>',
  JAVA = '<:java:669685001205448716>',
  PLACA_MINECRAFT = '<:info:669682580693712907>',
}

export const TICKET_EMOJIS = {
  REVIEW: Emojis.LABEL,
  REPORT: Emojis.RED_TICKET,
  QUESTION: Emojis.TICKET,
};

export const STATUS_EMOJIS: Record<PresenceStatusData, Emojis> = {
  offline: Emojis.STATUS_OFFLINE,
  online: Emojis.STATUS_ONLINE,
  dnd: Emojis.STATUS_BUSY,
  idle: Emojis.STATUS_AWAY,
};
