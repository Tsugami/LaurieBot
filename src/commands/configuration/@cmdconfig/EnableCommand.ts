// /* eslint-disable no-restricted-syntax */
// import LaurieCommand from '@structures/LaurieCommand';
// import LaurieEmbed from '@structures/LaurieEmbed';
// import { Command } from 'discord-akairo';
// import CmdConfigOption from './CmdConfigOption';

// export default class EnableCommand extends CmdConfigOption {
//   init() {
//     this.id = 'enable_command';
//     this.description = this.commandsDisabled.map(c => c.help).join(', ');
//     this.args = [
//       {
//         id: 'commands',
//         match: 'rest',
//         type: this.argumentType(),
//         prompt: this.prompts('command'),
//       },
//     ];
//   }

//   validate() {
//     return !!this.commandsDisabled.size;
//   }

//   get commandsDisabled() {
//     return this.command.client.commandHandler.modules.filter(c => this.validateCommand(c));
//   }

//   validateCommand(command: LaurieCommand) {
//     return this.guildData.disabledCommands.includes(command.id);
//   }

//   async run({ commands }: { commands: LaurieCommand[] }) {
//     await this.guildData.enableCommands(commands);
//     const commandHelped = commands.map(c => c.help).join(', ');
//     this.message.reply(
//       new LaurieEmbed(
//         this.message.author,
//         this.message.t(`${this.command.tPath}.enabled_commands`, { command: commandHelped }),
//       ),
//     );
//   }

//   argumentType() {
//     return (_: any, phrase: string) => {
//       const commands: Command[] = [];
//       const ids = phrase.match(/\w+/gi);
//       if (!ids) return null;
//       for (const id of ids) {
//         const command = this.command.handler.findCommand(id);
//         if (command && this.validateCommand(command)) commands.push(command);
//       }
//       return commands.length ? commands : null;
//     };
//   }
// }
