import {
    MessageEmbed,
    ClientEvents,
    Message,
    CommandInteraction,
    ApplicationCommandType,
    ApplicationCommandOptionData,
    CommandInteractionOptionResolver,
    CommandInteractionOption,
} from 'discord.js';
import ExtendedClient from '../Structures/Client';
import { Mentions } from '../Modules/Tools';
import Command from '../Structures/Command';
import { GuildCache, UserCache } from '../Structures/Cache';
import { LogDB } from '../Structures/Database/Models/Log';
import { UserDB } from '../Structures/Database/Models/User';
import { GuildDB } from '../Structures/Database/Models/Guild';
import { MemberDB } from '../Structures/Database/Models/Member';
import { EditedMessageDB } from '../Structures/Database/Models/EditedMessage';
import { DeletedMessageDB } from '../Structures/Database/Models/DeletedMessage';
import { Document, Types } from 'mongoose';

//#region //- Database

export type BaseDoc<T> = Document<any, any, T> & T & { _id: Types.ObjectId };

export type LogDoc = BaseDoc<LogDB>;
export type UserDoc = BaseDoc<UserDB>;
export type GuildDoc = BaseDoc<GuildDB>;
export type MemberDoc = BaseDoc<MemberDB>;
export type EditedMessageDoc = BaseDoc<EditedMessageDB>;
export type DeletedMessageDoc = BaseDoc<DeletedMessageDB>;

//#endregion

//#region //- ApexLegends

export type ApexPlatform = 'PC' | 'PS4' | 'X1';
export type CurrentLegends =
    | 'Revenant'
    | 'Crypto'
    | 'Horizon'
    | 'Gibraltar'
    | 'Wattson'
    | 'Fuse'
    | 'Bangalore'
    | 'Wraith'
    | 'Octane'
    | 'Bloodhound'
    | 'Caustic'
    | 'Lifeline'
    | 'Pathfinder'
    | 'Loba'
    | 'Mirage'
    | 'Rampart'
    | 'Valkyrie'
    | 'Seer'
    | 'Ash';

export interface ApexStatsEmbed {
    (
        platform: ApexPlatform,
        pId: string,
        token: string,
        client: ExtendedClient
    ): Promise<MessageEmbed>;
}
export interface ApexRotationEmbed {
    (token: string, client: ExtendedClient): Promise<MessageEmbed[]>;
}

//#endregion

//#region //- Commands

export interface CommandCategory {
    name: string;
    commands: Command[];
}

//+ TextCommand

interface Run_TCMD {
    (
        client: ExtendedClient,
        message: Message,
        args: string[],
        data: TextCommand_Data
    ): Promise<any>;
}

export interface TextCommand {
    aliases?: string[];
    usage: string;
    run: Run_TCMD;
}

export interface TextCommand_Data {
    prefix: string;
    userCache: UserCache;
    guildCache: GuildCache;
    fullArgs?: string;
}

//+ SlashCommand

interface Run_SCMD {
    (
        client: ExtendedClient,
        interaction: CommandInteraction,
        options: Omit<
            CommandInteractionOptionResolver,
            'getMessage' | 'getFocused'
        >,
        data: SlashCommand_Data
    ): Promise<any>;
}

interface EphemeralDefer {
    (client: ExtendedClient, interaction: CommandInteraction): Promise<boolean>;
}

export interface SlashCommand {
    type: ApplicationCommandType;
    options?: ApplicationCommandOptionData[];
    ephemeralDefer?: EphemeralDefer;
    run: Run_SCMD;
}

export interface SlashCommand_Data {
    userCache: UserCache;
    guildCache: GuildCache;
    optionsArray?: CommandInteractionOption[];
}

// export interface SlashCommand_Category {
//     name: string;
//     commands: SlashCommand[];
// }

//#endregion

//#region //- Client

export interface ClientServices {
    slashCommands: boolean;
    commands: boolean;
    snipe: boolean;
    editSnipe: boolean;
}

export interface Secrets {
    CLIENT_TOKEN: string;
    MONGO_URI: string;
    OWNER_ID: string;
    API_KEYS: API_Keys;
}

export interface API_Keys {
    CR: string;
    IBM: {
        ENDPOINT: string;
        KEY: string;
        INSTANCE_ID: string;
    };
    APEX: string;
}

export interface ClientTools {
    mentions: typeof Mentions;
}
export interface Config {
    prefix: string;
    embed_footer: string;
    color: number;
}

//#endregion

//#region //- FIlter

interface Evaluate {
    (client: ExtendedClient, message: Message): Promise<boolean>;
}

export interface Filter {
    name: string;
    enabled: boolean;
    evaluate: Evaluate;
}

//#endregion

//#region //- Event

interface Run_EVNT {
    (client: ExtendedClient, ...args: any[]): Promise<any>;
}

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    run: Run_EVNT;
}

//#endregion
