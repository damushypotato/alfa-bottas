import { MessageEmbed, ClientEvents, Message } from 'discord.js';
import Client from '../Structures/Client';
import { Mentions } from '../Modules/Tools';
import Command from '../Structures/Command';
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
    | 'Ash'
    | 'Mad Maggie'
    | 'Newcastle';

export interface ApexStatsEmbed {
    (platform: ApexPlatform, pId: string, token: string, client: Client): Promise<MessageEmbed>;
}
export interface ApexRotationEmbed {
    (token: string, client: Client): Promise<MessageEmbed[]>;
}

//#endregion

//#region //- Commands

export interface CommandCategory {
    name: string;
    commands: Command[];
}

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
    IBM: IBM;
    OWNER_ID: string;
    API_KEYS: API_Keys;
}

export interface IBM {
    ENDPOINT: string;
    KEY: string;
    INSTANCE_ID: string;
}

export interface API_Keys {
    CR: string;
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

//#region //- Filter

export interface Filter {
    name: string;
    enabled: boolean;
    evaluate: (client: Client, message: Message) => Promise<boolean>;
}

//#endregion

//#region //- Event

interface Run_EVNT {
    (client: Client, ...args: any[]): Promise<any>;
}

export interface Event {
    name: keyof ClientEvents;
    once?: boolean;
    run: Run_EVNT;
}

//#endregion

//#region //- Music
export const modeLookup = {
    0: '❌ Off',
    1: '🔂 Single Track',
    2: '🔁 Queue (Classic)',
    3: '↪️ Autoplay',
};

interface GeniusUrl {
    genius: string;
}

export interface SongData {
    title: string;
    author: string;
    lyrics: string;
    thumbnail: GeniusUrl;
    links: GeniusUrl;
    disclaimer: string;
}

//#endregion
