import { LogDB } from '../MongoDB/Models/Log'
import { UserDB } from '../MongoDB/Models/User'
import { GuildDB } from '../MongoDB/Models/Guild'
import { MemberDB } from '../MongoDB/Models/Member'
import { EditedMessageDB } from '../MongoDB/Models/EditedMessage'
import { DeletedMessageDB } from '../MongoDB/Models/DeletedMessage'
import { Document, ObjectId } from 'mongoose';

export type BaseDoc<T> = Document<any, any, T> & T & {_id: ObjectId};

export type LogDoc = BaseDoc<LogDB>;
export type UserDoc = BaseDoc<UserDB>;
export type GuildDoc = BaseDoc<GuildDB>;
export type MemberDoc =  BaseDoc<MemberDB>;
export type EditedMessageDoc =  BaseDoc<EditedMessageDB>;
export type DeletedMessageDoc =  BaseDoc<DeletedMessageDB>;
