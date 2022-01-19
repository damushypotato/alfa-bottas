import { Intents } from 'discord.js';
const { FLAGS: int } = Intents;
export const clientIntents = [
    int.GUILDS,
    int.GUILD_MEMBERS,
    int.GUILD_BANS,
    int.GUILD_EMOJIS_AND_STICKERS,
    int.GUILD_INTEGRATIONS,
    int.GUILD_WEBHOOKS,
    int.GUILD_INVITES,
    int.GUILD_VOICE_STATES,
    int.GUILD_PRESENCES,
    int.GUILD_MESSAGES,
    int.GUILD_MESSAGE_REACTIONS,
    int.GUILD_MESSAGE_TYPING,
    int.DIRECT_MESSAGES,
    int.DIRECT_MESSAGE_REACTIONS,
    int.DIRECT_MESSAGE_TYPING,
];