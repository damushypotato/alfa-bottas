import { Intents } from 'discord.js';
const { FLAGS: infl } = Intents;
export const clientIntents = [
    infl.GUILDS,
    infl.GUILD_MEMBERS,
    infl.GUILD_BANS,
    infl.GUILD_EMOJIS_AND_STICKERS,
    infl.GUILD_INTEGRATIONS,
    infl.GUILD_WEBHOOKS,
    infl.GUILD_INVITES,
    infl.GUILD_VOICE_STATES,
    infl.GUILD_PRESENCES,
    infl.GUILD_MESSAGES,
    infl.GUILD_MESSAGE_REACTIONS,
    infl.GUILD_MESSAGE_TYPING,
    infl.DIRECT_MESSAGES,
    infl.DIRECT_MESSAGE_REACTIONS,
    infl.DIRECT_MESSAGE_TYPING,
]