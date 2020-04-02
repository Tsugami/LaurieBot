import { ArgumentType, ArgumentOptions, Inhibitor, Listener, CommandOptions } from 'discord-akairo';
import categories from '@struct/categories';
import {
  Message,
  Guild,
  GuildMember,
  User,
  Channel,
  Collection,
  Invite,
  Emoji,
  Role,
  VoiceChannel,
  TextChannel,
} from 'discord.js';

export interface CustomArgumentOptions<A = any> extends ArgumentOptions {
  id: string;
  type: Exclude<NonNullable<ArgumentType>, string[]>;
  default?: (message: Message, args: A) => any;
}

type CmdOptions = Omit<CommandOptions, 'defaultPrompt'>;
export interface LaurieCommandOptions extends CmdOptions {
  category: keyof typeof categories;
  args?: CustomArgumentOptions[];
}

export interface ArgsTypes {
  string: string;
  number: number;
  guild: Guild;
  guilds: Guild[];
  lowercase: string;
  uppercase: string;
  charCodes: string[];
  integer: number;
  dynamic: number;
  dynamicInt: number;
  url: string;
  date: Date;
  color: string;
  commandAlias: string;
  command: string;
  inhibitor: Inhibitor;
  listener: Listener;
  user: User;
  users: User[];
  member: GuildMember;
  members: GuildMember[];
  relevant: string; // dms
  relevants: string[]; // dms
  channel: Channel;
  channels: Channel[];
  textChannel: TextChannel;
  textChannels: TextChannel[];
  voiceChannel: VoiceChannel;
  voiceChannels: VoiceChannel[];
  role: Role;
  roles: Role[];
  emoji: Emoji;
  emojis: Emoji[];
  message: Message;
  invite: Invite;
  memberMention: Collection<string, GuildMember>;
  channelMention: Collection<string, Channel>;
  roleMention: Collection<string, Role>;
  emojiMention: Collection<string, Emoji>;
}
