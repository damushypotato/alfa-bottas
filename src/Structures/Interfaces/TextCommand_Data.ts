import { TextCommand } from '.';
import { GuildCache, UserCache } from '../../Modules/Cache';

export interface TextCommand_Data {
    prefix: string;
    userCache: UserCache;
    guildCache: GuildCache;
    fullArgs?: string;
}
