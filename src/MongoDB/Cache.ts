import Client from '../Client';
import { Collection, Guild, User } from 'discord.js';
import { GuildDoc, UserDoc } from '../Types/Database';
import { Document, ObjectId } from 'mongoose';

class BaseCache<T> {
    constructor(db: Document<any, any, T> & T & {_id: ObjectId}) {
        this.db = db._id;
    }

    protected db: ObjectId;
}

export class GuildCache extends BaseCache<GuildDoc> {
    constructor(guildDB: GuildDoc, client: Client) {
        super(guildDB);

        this.prefix = guildDB.prefix || client.config.prefix;
    }

    public prefix: string;
}

export class UserCache extends BaseCache<UserDoc> {
    constructor(userDB: UserDoc, client: Client) {
        super(userDB);

        this.OP = userDB.OP || false;
    }

    public OP: boolean;
}

export default class CacheManager {
    constructor(client: Client) {
        this.client = client;
    }

    public client: Client;
    public guildCache: Collection<string, GuildCache> = new Collection();
    public userCache: Collection<string, UserCache> = new Collection();

    public fetchAndUpdateGuild(guildDB: GuildDoc) {
        const cache = new GuildCache(guildDB, this.client)
        this.guildCache.set(guildDB.id, cache);
        return cache;
    }

    public async fetchGuildCache(guild: Guild) {
        return this.guildCache.get(guild.id) || this.fetchAndUpdateGuild(await this.client.database.fetchGuildDB(guild));
    }

    public fetchAndUpdateUser(userDB: UserDoc) {
        const cache = new UserCache(userDB, this.client)
        this.userCache.set(userDB.id, cache);
        return cache;
    }

    public async fetchUserCache(user: User) {
        return this.userCache.get(user.id) || this.fetchAndUpdateUser(await this.client.database.fetchUserDB(user));
    }
}