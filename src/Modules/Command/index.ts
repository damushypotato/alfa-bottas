import { PermissionString } from 'discord.js';
import { SlashCommand, TextCommand } from '../../Structures/Interfaces';

interface CommandConfig {
    name: string;
    description: string;
    textCommand?: TextCommand;
    slashCommand?: SlashCommand;
    memberPerms?: PermissionString[];
    clientPerms?: PermissionString[];
    ownerOnly?: boolean;
    opOnly?: boolean;
    category?: string;
}

export default class Command {
    constructor(config: CommandConfig) {
        this.name = config.name;
        this.description = config.description;
        this.category = config.category;
        this.textCommand = config.textCommand;
        this.slashCommand = config.slashCommand;
        
        this.memberPerms = config.memberPerms || [];
        this.clientPerms = config.clientPerms || [];
        this.ownerOnly = config.ownerOnly || false;
        this.opOnly = config.opOnly || false;
    }

    public name: string;
    public description: string;

    public textCommand: TextCommand;
    public slashCommand: SlashCommand;

    public memberPerms: PermissionString[];
    public clientPerms: PermissionString[];

    public ownerOnly: boolean;
    public opOnly: boolean;

    public category: string;
}
