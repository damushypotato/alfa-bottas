import {
    PermissionString,
    ApplicationCommandData,
    Message,
    InteractionReplyOptions,
    MessagePayload,
    Interaction,
    CommandInteraction,
    MessageEmbed,
    MessageOptions,
    MessageEditOptions,
} from 'discord.js';
import Client from '../Client';
import { GuildCache, UserCache } from '../Database/Cache';
import { SlashCommand } from './Slash';
import { TextCommand } from './Text';

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

    public run: (ctx: CommandContext) => Promise<any>;

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

    public sendUsage(message: Message, prefix: string, edit = false) {
        if (!this.textCommand) {
            process.emitWarning(
                `Cannot get usage for command '${this.name}' because it does not have a textCommand property.`
            );
            return;
        }
        if (!edit) return message.channel.send(this.getUsage(prefix));
        else return message.edit(this.getUsage(prefix));
    }
}

export class CommandContext {
    constructor(
        public context: CommandInteraction | Message,
        public client: Client,
        public userCache: UserCache,
        public guildCache: GuildCache
    ) {
        this.messageSender = (this.context as Message)?.channel.send;
        this.interactionSender = (this.context as CommandInteraction).followUp;
    }

    messageSender: Message['channel']['send'] | Message['reply'] | Message['edit'];
    interactionSender: CommandInteraction['followUp'] | Message['edit'];

    async send(
        content:
            | string
            | MessageOptions
            | InteractionReplyOptions
            | MessagePayload
            | MessageEditOptions,
        setEditMode = false
    ) {
        if (this.isInteraction()) {
            const sent = await (this.context as CommandInteraction).followUp(
                content as InteractionReplyOptions | string
            );
            if (setEditMode) {
                this.interactionSender = (sent as Message).edit;
            }
        } else {
            const sent = await this.messageSender(content as string | MessagePayload);
            if (setEditMode) this.messageSender = sent.edit;
            return sent;
        }
    }

    sendEmbed(embeds: MessageEmbed | MessageEmbed[], setEditMode = false) {
        if (!Array.isArray(embeds)) {
            embeds = [embeds];
        }
        return this.send({ embeds }, setEditMode);
    }

    sendFetchingEmbed(setEditMode = false) {
        return this.sendEmbed(this.client.fetchingEmbed(), setEditMode);
    }

    sendApiFailEmbed(setEditMode = false) {
        return this.sendEmbed(this.client.apiFailEmbed(), setEditMode);
    }

    isInteraction() {
        return this.context instanceof Interaction;
    }

    isMessage() {
        return this.context instanceof Message;
    }
}
