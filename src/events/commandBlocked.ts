import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js'
import Permissions from '../assets/permissions.json'

function getPermissions (permission: string): string {
	return Permissions[permission]
}

const disableCommandsCooldown = new Set<string>()

function addUserCooldown (userId: string): void {
	disableCommandsCooldown.add(userId)
	setTimeout(() => disableCommandsCooldown.delete(userId), 2 * 60000)
}

function userIsCooldown (userId: string): boolean {
	return disableCommandsCooldown.has(userId)
}

export default class CommandBlockedListener extends Listener {
  constructor() {
    super('commandBlocked', {
      emitter: 'commandHandler',
      eventName: 'commandBlocked',
    });
  }

  exec(msg: Message, command: Command, reason: string) {
  	switch (reason) {
  		case 'userPermissions': {
  			msg.reply(`você não possui permissão de **${getPermissions(String(command.userPermissions))}** pra executar esse comando.`)
    		break
    	}
    	case 'clientPermissions': {
  			msg.reply(`eu não possuo permissão de **${getPermissions(String(command.userPermissions))}** pra executar esse comando.`)
    		break
    	}
    	case 'disableCommands': {
    		if (userIsCooldown(msg.author.id)) {
    			addUserCooldown(msg.author.id)
    			msg.reply('os comandos não estão habilitados nesse canal.')
    		}
    	}
  	}
  }
}
