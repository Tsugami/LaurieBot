import { PresenceStatusData } from 'discord.js';
import { RateTypes } from '@database/models/Guild';

export const CUSTOM_STATUS = 'Custom Status';
export const EMBED_DEFAULT_COLOR = process.env.EMBED_DEFAULT_COLOR || '#ff8c08';
export const MUTE_ROLE_NAME = 'Mutado';
export const ASSET_BASE_PATH = 'https://storage.googleapis.com/data-sunlight-146313.appspot.com';
export const EMOJIS = {
  FOLDER: '📁',
  CROWN: '👑',
  COMPUTER: '💻',
  CALENDER: '📆',
  PERSON: '👤',
  PERSONS: '👥',
  ROBOT: '🤖',
  STRONKS: '📈',
  NOT_STRONKS: '📉',
  TICKET: '🎫',
  EARTH: '🌍',
  INBOX: '📥',
  UNKNOWN: '❓',
  TV: '📺',
  VIDEO_GAME: '🎮',
  HEADPHONES: '🎧',
  UNLOCK: '🔓',
  LOCK: '🔒',
  VIDEO_CAMERA: '📹',
  BRIEFCASE: '💼',
  PINCHING_HAND: '🤏',
  JOIA: '👍',
  LUL: '🤪',
  DOOR: '🚪',
  OX: '🐂',
  LABEL: '🏷️',
  SHIELD: '🛡️',
  KEYBOARD: '⌨️',
  MAN_JUDGE: '👨‍⚖️',
  BALLOT_BOX: '🗳️',
  PAGE: '📄',
  SCALES: '⚖️',
  CAP: '🧢',
  CARD_INDEX: '📇',
  SPEECH_BALLON: '💬',
  RED_TICKET: '🎟️',
  WARN: '⚠️',
  GEAR: '⚙️',
  POLICE_OFFICER: '👮',
  RTT: '🔂',
  HEART: '❤️',
  HEARTBEAT: '💟',
  PING_PONG: '🏓',
  GOOD_FACE: '😁',
  OH_FACE: '😐',
  WINK: '😉',
  BAD_FACE: '☹️',
  GOOD_LOG: `<:online:669594447251636226>`,
  BAD_LOG: '<:ocupado:669594449440931846>',
  GIFT_HEART: '💝',
  RED_ENVELOPE: '🧧',
  ANUNCIAR: '<a:anunciar:671077734566461440>',
  STATUS_ONLINE: '<:online:669594447251636226>',
  STATUS_OFFLINE: '<:offline:669594447138258964>',
  STATUS_BUSY: '<:ocupado:669594449440931846>',
  STATUS_AWAY: '<:ausente:669594447108898821>',
  WALLET: '<:identidade:669615608622481441>',
  JAVA: '<:java:669685001205448716>',
  PLACA_MINECRAFT: '<:info:669682580693712907>',
  MINECRAFT: '<a:minecraft:671813949729275924>',
  RINDO_DOIDO: '<a:interatividade:671813965239549997>',
  CONFIGURAR: '<:configurar:671814632255651851>',
  DISCORD: '<:discord:671813977961005067>',
} as const;

export type EmojiType = typeof EMOJIS[keyof typeof EMOJIS];

export const TICKET_EMOJIS = {
  REVIEW: EMOJIS.LABEL,
  REPORT: EMOJIS.RED_TICKET,
  QUESTION: EMOJIS.TICKET,
};

export const STATUS_EMOJIS: Record<PresenceStatusData, EmojiType> = {
  offline: EMOJIS.STATUS_OFFLINE,
  online: EMOJIS.STATUS_ONLINE,
  dnd: EMOJIS.STATUS_BUSY,
  idle: EMOJIS.STATUS_AWAY,
};

export const RATE_EMOJIS: Record<RateTypes, EmojiType> = {
  good: EMOJIS.GOOD_FACE,
  bad: EMOJIS.BAD_FACE,
  normal: EMOJIS.OH_FACE,
};

export const ERROR_CHANNEL_ID = '675412206988427284';
