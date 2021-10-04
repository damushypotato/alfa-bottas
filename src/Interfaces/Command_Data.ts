import { Command } from '.';
import { GuildCache, UserCache } from '../MongoDB/Cache';

export interface Command_Data {
    prefix: string;
    userCache: UserCache;
    guildCache: GuildCache;
}
