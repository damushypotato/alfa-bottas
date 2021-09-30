import { LogDB } from '../MongoDB/Models/Log'
import { UserDB } from '../MongoDB/Models/User'
import { GuildDB } from '../MongoDB/Models/Guild'
import { MemberDB } from '../MongoDB/Models/Member'
import { DeletedMessageDB } from '../MongoDB/Models/DeletedMessage'
import { Document, Types } from 'mongoose';

export type LogDoc = Document<any, any, LogDB> & LogDB & {_id: Types.ObjectId};
export type UserDoc = Document<any, any, UserDB> & UserDB & {_id: Types.ObjectId};
export type GuildDoc = Document<any, any, GuildDB> & GuildDB & {_id: Types.ObjectId};
export type MemberDoc =  Document<any, any, MemberDB> & MemberDB & {_id: Types.ObjectId};
export type DeletedMessageDoc =  Document<any, any, DeletedMessageDB> & DeletedMessageDB & {_id: Types.ObjectId};
