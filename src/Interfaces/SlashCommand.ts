import { PermissionString, ApplicationCommandType, ApplicationCommandOptionData, CommandInteractionOptionResolver, CommandInteraction } from 'discord.js';
import Client from '../Client';
import { SlashCommand_Data } from '.';

interface Run {
    (client: Client, interaction: CommandInteraction, options: CommandInteractionOptionResolver, data: SlashCommand_Data): void
}

export interface SlashCommand {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: ApplicationCommandOptionData[];
    defaultPermission?: boolean;
    memberPerms?: PermissionString[];
    clientPerms?: PermissionString[];
    ownerOnly?: boolean;
    opOnly?: boolean;
    category?: string;
    run: Run;
}
