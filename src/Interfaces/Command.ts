import Client from '../Client';
import { Message, PermissionString } from 'discord.js';
import { Command_Data } from '.';

interface Run {
    (client: Client, message: Message, args: string[], data: Command_Data)
}

export interface Command {
    name: string,
    description?: string,
    aliases?: string[],
    memberPerms?: PermissionString[],
    clientPerms?: PermissionString[],
    ownerOnly?: boolean,
    opOnly?: boolean,
    run: Run;
}
