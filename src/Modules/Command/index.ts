import { PermissionString, ApplicationCommandData, Message } from 'discord.js';
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

    public toApplicationCommand() {
        if (!this.slashCommand) {
            process.emitWarning(
                `Command '${this.name}' cannot be converted to applicationCommand because it does not have a slashCommand property.`
            );
            return;
        }
        return {
            name: this.name,
            description: this.description,
            type: this.slashCommand.type,
            options: this.slashCommand.options,
        } as ApplicationCommandData;
    }

    public getUsage(prefix: string) {
        if (!this.textCommand) {
            process.emitWarning(
                `Cannot get usage for command '${this.name}' because it does not have a textCommand property.`
            );
            return;
        }
        return `Usage: \`${prefix}${this.name} ${this.textCommand.usage}\``;
    }

    public sendUsage(message: Message, prefix: string) {
        if (!this.textCommand) {
            process.emitWarning(
                `Cannot get usage for command '${this.name}' because it does not have a textCommand property.`
            );
            return;
        }
        return message.channel.send(this.getUsage(prefix));
    }
}
