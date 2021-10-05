import { GuildCache, UserCache } from '../MongoDB/Cache';

export interface SlashCommand_Data {
    userCache: UserCache;
    guildCache: GuildCache;
}
