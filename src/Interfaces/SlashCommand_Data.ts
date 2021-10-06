import { CommandInteractionOption } from 'discord.js';
import { GuildCache, UserCache } from '../MongoDB/Cache';

export interface SlashCommand_Data {
    userCache: UserCache;
    guildCache: GuildCache;
    optionsArray?: CommandInteractionOption[];
}
