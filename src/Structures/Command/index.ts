import {
    PermissionsString,
    ApplicationCommandData,
    Message,
    InteractionReplyOptions,
    MessagePayload,
    CommandInteraction,
    EmbedBuilder,
    ApplicationCommandOptionData,
    AutocompleteInteraction,
    ApplicationCommandType,
    ChatInputCommandInteraction,
    CommandInteractionOptionResolver,
    CacheType,
} from 'discord.js';
import Client from '../Client';
import { GuildCache, UserCache } from '../Database/Cache';
interface CommandConfig {
    name: string;
    description: string;
    options: ApplicationCommandOptionData[];
    memberPerms?: PermissionsString[];
    clientPerms?: PermissionsString[];
    ownerOnly?: boolean;
    opOnly?: boolean;
    category?: string;
    run: (
        client: Client,
        interaction: ChatInputCommandInteraction,
        options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
        ctx: CommandContext,
        userCache: UserCache,
        guildCache: GuildCache
    ) => Promise<any>;

    ephemeralDefer?: (
        client: Client,
        interaction: ChatInputCommandInteraction,
        options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
        ctx: CommandContext,
        userCache: UserCache,
        guildCache: GuildCache
    ) => Promise<boolean>;

    autocomplete?: (client: Client, interaction: AutocompleteInteraction) => Promise<unknown>;
}

export default class Command implements CommandConfig {
    constructor(config: CommandConfig) {
        this.name = config.name;
        this.description = config.description;
        this.options = config.options;
        this.memberPerms = config.memberPerms;
        this.clientPerms = config.clientPerms;
        this.ownerOnly = config.ownerOnly;
        this.opOnly = config.opOnly;
        this.category = config.category;
        this.run = config.run;
        this.ephemeralDefer = config.ephemeralDefer;
        this.autocomplete = config.autocomplete;
    }

    name: string;
    description: string;
    options: ApplicationCommandOptionData[];
    memberPerms?: PermissionsString[];
    clientPerms?: PermissionsString[];
    ownerOnly?: boolean;
    opOnly?: boolean;
    category?: string;

    run: (
        client: Client,
        interaction: ChatInputCommandInteraction,
        options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
        ctx: CommandContext,
        userCache: UserCache,
        guildCache: GuildCache
    ) => Promise<any>;

    ephemeralDefer?: (
        client: Client,
        interaction: ChatInputCommandInteraction,
        options: Omit<CommandInteractionOptionResolver<CacheType>, 'getMessage' | 'getFocused'>,
        ctx: CommandContext,
        userCache: UserCache,
        guildCache: GuildCache
    ) => Promise<boolean>;

    autocomplete?: (client: Client, interaction: AutocompleteInteraction) => Promise<unknown>;

    toApplicationCommand(): ApplicationCommandData {
        const { name, description, options } = this;
        return {
            name,
            description,
            type: ApplicationCommandType.ChatInput,
            options,
        };
    }
}

export class CommandContext {
    constructor(private interaction: ChatInputCommandInteraction, private client: Client) {}

    sent: Message[] = [];

    async send(content: string | MessagePayload | InteractionReplyOptions) {
        const sent = await this.interaction.followUp(content);
        this.sent.push(sent);
        return sent;
    }

    sendEmbed(embeds: EmbedBuilder | EmbedBuilder[]) {
        if (!Array.isArray(embeds)) {
            embeds = [embeds];
        }
        return this.send({ embeds });
    }

    sendFetchingEmbed() {
        return this.sendEmbed(this.client.fetchingEmbed());
    }

    sendApiFailEmbed() {
        return this.sendEmbed(this.client.apiFailEmbed());
    }
}
