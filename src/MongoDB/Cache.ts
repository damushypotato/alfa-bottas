import Client from '../Client';
import { Collection } from 'discord.js';
import { GuildDoc } from '../Types/Database';

interface GuildCache {
    prefix: string;
}

export default class Cache {
    constructor(client: Client) {
        this.client = client;
    }

    public client: Client;
    public guildCache: Collection<string, GuildCache> = new Collection();

    public async updateGuild(guildDB: GuildDoc) {
        const newCache: GuildCache = {
            prefix: guildDB.prefix || this.client.config.prefix,
        }

        this.guildCache.set(guildDB.id, newCache);
    }
}