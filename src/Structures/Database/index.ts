import { User, Guild, GuildMember, Message, TextChannel } from 'discord.js';
import {
    UserModel,
    GuildModel,
    LogModel,
    MemberModel,
    DeletedMessageModel,
    EditedMessageModel,
} from './Models';
import { ObjectId, connect } from 'mongoose';
import { UserDoc, GuildDoc, MemberDoc } from '../../Types';
import CacheManager from '../Cache';
import Client from '../Client';
import { S3 } from 'ibm-cos-sdk';
import axios from 'axios';

export interface MultiDB {
    userDB: UserDoc;
    guildDB: GuildDoc;
    memberDB: MemberDoc;
}

export default class Database {
    constructor(client: Client) {
        this.client = client;
        this.cache = new CacheManager(this.client);
    }

    public client: Client;
    public cache: CacheManager;
    public cos: S3;

    public async connect() {
        console.log('Initializing database connections...\n');

        let time = Date.now();
        const initTime = time;

        console.log('Connecting to MongoDB database...');
        try {
            await connect(this.client.secrets.MONGO_URI);
            console.log(`Done! (${Date.now() - time}ms)\n`);
        } catch (e) {
            console.log('MongoDB connection error:', e);
            process.exit(0);
        }
        time = Date.now();
        console.log('Connecting to IBM COS database...');
        try {
            this.cos = new S3({
                endpoint: this.client.secrets.API_KEYS.IBM.ENDPOINT,
                apiKeyId: this.client.secrets.API_KEYS.IBM.KEY,
                serviceInstanceId: this.client.secrets.API_KEYS.IBM.INSTANCE_ID,
                signatureVersion: 'iam',
            });
            console.log(`Done! (${Date.now() - time}ms)\n`);
        } catch (e) {
            console.log('IBM COS connection error:', e);
            process.exit(0);
        }
        console.log(
            `Done initializing database connections. (Total ${
                Date.now() - initTime
            }ms)\n`
        );
    }

    public async fetchUserDB(user: User) {
        const userDB = await UserModel.findOne({ id: user.id });

        let db: UserDoc;
        if (userDB) {
            if (user.tag != userDB.tag) {
                userDB.tag = user.tag;
                await userDB.save();
            }
            db = userDB;
        } else {
            const newUser = new UserModel({
                id: user.id,
                OP: false,
                tag: user.tag,
                registeredTime: Date.now(),
            });
            await newUser.save();
            db = newUser;
        }
        this.cache.fetchAndUpdateUser(db);
        return db;
    }

    public async fetchGuildDB(guild: Guild) {
        const guildDB = await GuildModel.findOne({ id: guild.id });

        let db: GuildDoc;
        if (guildDB) {
            if (
                guild.memberCount != guildDB.lastMemberCount ||
                guild.name != guildDB.name
            ) {
                guildDB.lastMemberCount = guild.memberCount;
                guildDB.name = guild.name;
                await guildDB.save();
            }
            db = guildDB;
        } else {
            const newGuild = new GuildModel({
                id: guild.id,
                name: guild.name,
                lastMemberCount: guild.memberCount,
                registeredTime: Date.now(),
            });
            await newGuild.save();
            db = newGuild;
        }
        this.cache.fetchAndUpdateGuild(db);
        return db;
    }

    public async fetchMemberDB(user_id: ObjectId, guild_id: ObjectId) {
        const memberDB = await MemberModel.findOne({
            user: user_id,
            guild: guild_id,
        });

        if (memberDB) {
            return memberDB;
        } else {
            const newMember = new MemberModel({
                user: user_id,
                guild: guild_id,
                registeredTime: Date.now(),
            });
            await newMember.save();
            return newMember;
        }
    }

    public async fetchMultiDB(member: GuildMember) {
        const [userDB, guildDB] = await Promise.all([
            this.fetchUserDB(member.user),
            this.fetchGuildDB(member.guild),
        ]);

        const memberDB = await this.fetchMemberDB(userDB._id, guildDB._id);

        const multiDB: MultiDB = {
            userDB,
            guildDB,
            memberDB,
        };

        return multiDB;
    }

    public async createDeletedMessage(message: Message) {
        const { memberDB } = await this.fetchMultiDB(
            message.member as GuildMember
        );

        const delMsgDB = new DeletedMessageModel({
            member: memberDB._id,
            authorTag: message.author.tag,
            authorID: message.author.id,
            guildName: message.guild.name,
            guildID: message.guildId,
            channelName: (message.channel as TextChannel).name,
            channelID: message.channelId,
            content: message.content || '`Message had no text.`',
            createdAt: message.createdTimestamp,
            deletedAt: Date.now(),
        });

        delMsgDB.attachments = await Promise.all(
            message.attachments
                .map((a) => {
                    if (a.size < 8000000) {
                        return a;
                    }
                })
                .filter(Boolean)
                .map(async (a, i) => {
                    const attch = await axios.get(a.url, {
                        responseType: 'arraybuffer',
                    });
                    const name = `${delMsgDB._id}-${i}.${a.name
                        .split('.')
                        .at(-1)}`;
                    await this.cos
                        .putObject({
                            Bucket: 'deletedfiles',
                            Key: name,
                            Body: attch.data,
                        })
                        .promise();
                    return name;
                })
        );
        await delMsgDB.save();

        return delMsgDB;
    }

    public async fetchDeletedMessages(channel_id: string, number: number) {
        const delMsgDB = await DeletedMessageModel.find(
            { channelID: channel_id },
            {},
            { sort: { deletedAt: -1 }, limit: number }
        );
        return delMsgDB;
    }

    public async createEditedMessage(oldMessage: Message, newMessage: Message) {
        const { memberDB } = await this.fetchMultiDB(
            newMessage.member as GuildMember
        );

        const edtMsgDB = new EditedMessageModel({
            member: memberDB._id,
            messageID: oldMessage.id,
            authorTag: newMessage.author.tag,
            authorID: newMessage.author.id,
            guildName: newMessage.guild.name,
            guildID: newMessage.guildId,
            channelName: (newMessage.channel as TextChannel).name,
            channelID: newMessage.channelId,
            oldContent: oldMessage.content || '`Message had no text.`',
            newContent: newMessage.content || '`Message had no text.`',
            createdAt: oldMessage.createdTimestamp,
            editedAt: Date.now(),
        });
        await edtMsgDB.save();
        return edtMsgDB;
    }

    public async fetchEditedMessages(channel_id: string, number: number) {
        const edtMsgDB = await EditedMessageModel.find(
            { channelID: channel_id },
            {},
            { sort: { editedAt: -1 }, limit: number }
        );
        return edtMsgDB;
    }

    //Create error log
    public async createErrorLog(title: string, error: string) {
        const errorLog = new LogModel({
            title,
            message: error,
            time: Date.now(),
        });
        await errorLog.save();
        return errorLog;
    }
}
