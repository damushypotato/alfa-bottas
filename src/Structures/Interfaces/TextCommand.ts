import Client from '../../Client';
import { Message } from 'discord.js';
import { TextCommand_Data } from '.';

interface Run {
    (client: Client, message: Message, args: string[], data: TextCommand_Data): void
}

export interface TextCommand {
    aliases?: string[];
    usage: string;
    run: Run;
}
