import { User, Guild, GuildMember, Message, TextChannel } from 'discord.js';
import { UserModel } from './Models/User';
import { GuildModel } from './Models/Guild';
import { MemberModel } from './Models/Member';
import { DeletedMessageModel } from './Models/DeletedMessage';
import { LogModel } from './Models/Log';
import { ObjectId } from 'mongoose';
import { UserDoc, GuildDoc, MemberDoc } from '../Types/Database'

//Create/find users Database
export async function fetchUserDB(user: User) {
    const userDB = await UserModel.findOne({ id: user.id });

    if (userDB) {
        if (user.tag != userDB.tag) {
            userDB.tag = user.tag;
            await userDB.save();
        }
        return userDB;
    }
    else {
        const newUser = new UserModel({
            id: user.id,
            OP: false,
            tag: user.tag,
            registeredTime: Date.now(),
        })
        await newUser.save();
        return newUser;
    }
};

//Create/find Guilds Database
export async function fetchGuildDB(guild: Guild) {
    const guildDB = await GuildModel.findOne({ id: guild.id });

    if (guildDB) {
        if (guild.memberCount != guildDB.lastMemberCount ||
            guild.name != guildDB.name) {
                guildDB.lastMemberCount = guild.memberCount;
                guildDB.name = guild.name;
                await guildDB.save();
        }
        return guildDB;
    } else {
        const newGuild = new GuildModel({
            id: guild.id,
            name: guild.name,
            lastMemberCount: guild.memberCount,
            registeredTime: Date.now(),
        });
        await newGuild.save();
        return newGuild;
    }
};

//Create/find members Database
export async function fetchMemberDB(user_id: ObjectId, guild_id: ObjectId) {
    const memberDB = await MemberModel.findOne({ user: user_id, guild: guild_id });

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
};

//get all databases for normal message event in one

export interface MultiDB {
    user: UserDoc;
    guild: GuildDoc;
    member: MemberDoc;
}

export async function fetchMultiDB(member: GuildMember) {
    const [userDB, guildDB] = await Promise.all([fetchUserDB(member.user), fetchGuildDB(member.guild)]);

    const memberDB = await fetchMemberDB(userDB._id, guildDB._id);

    const multiDB: MultiDB = {
        user: userDB,
        guild: guildDB,
        member: memberDB
    }

    return multiDB;
}

//Create new deleted message db
export async function createDeletedMessage(message: Message) {
    const { member } = await fetchMultiDB(message.member);

    const delMsgDB = new DeletedMessageModel({
        member: member._id,
        authorTag: message.author.tag,
        authorID: message.author.id,
        guildName: message.guild.name,
        guildID: message.guild.id,
        channelName: (message.channel as TextChannel).name,
        channelID: message.channelId,
        content: message.content || '`Message had no text.`',
        createdAt: message.createdTimestamp,
        deletedAt: Date.now(),
        attachments: message.attachments.map(a => a.url)
    });
    await delMsgDB.save();
    return delMsgDB;
};

export async function fetchDeletedMessage(channel_id: string) {
    const delMsgDB = await DeletedMessageModel.findOne({ channelID: channel_id }, {}, { sort: { deletedAt: -1 }});
    return delMsgDB;
}

//Create error log
export async function createErrorLog(title: string, error: string) {
    const errorLog = new LogModel({
        title,
        message: error,
        time: Date.now(),
    });
    await errorLog.save();
    return errorLog;
};
