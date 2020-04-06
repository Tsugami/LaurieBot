import categories from '@struct/command/categories';
import {
  ArgumentType,
  ArgumentOptions,
  Inhibitor,
  Listener,
  CommandOptions,
  ArgumentTypeFunction,
} from 'discord-akairo';
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
  Snowflake,
} from 'discord.js';

export type LaurieArgType = Exclude<NonNullable<ArgumentType>, string[]>;
export interface CustomArgumentOptions<A = any> extends ArgumentOptions {
  id: string;
  type: LaurieArgType | ArgumentTypeFunction;
  default?: (message: Message, args: A) => any;
}

type CmdOptions = Omit<CommandOptions, 'defaultPrompt'>;
export interface LaurieCommandOptions extends CmdOptions {
  category: keyof typeof categories;
  args?: CustomArgumentOptions[];
  autoPrompt?: boolean;
}

export interface ArgsTypes {
  string: string;
  number: number;
  guild: Guild;
  guilds: Collection<Snowflake, Guild>;
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
  users: Collection<Snowflake, User>;
  member: GuildMember;
  members: Collection<Snowflake, GuildMember>;
  relevant: string; // dms
  relevants: string[]; // dms
  channel: Channel;
  channels: Collection<Snowflake, Channel>;
  textChannel: TextChannel;
  textChannels: Collection<Snowflake, TextChannel>;
  voiceChannel: VoiceChannel;
  voiceChannels: Collection<Snowflake, VoiceChannel>;
  role: Role;
  roles: Collection<Snowflake, Role>;
  emoji: Emoji;
  emojis: Collection<Snowflake, Emoji>;
  message: Message;
  invite: Invite;
  memberMention: Collection<string, GuildMember>;
  channelMention: Collection<string, Channel>;
  roleMention: Collection<string, Role>;
  emojiMention: Collection<string, Emoji>;
}
