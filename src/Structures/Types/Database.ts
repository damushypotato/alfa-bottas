import { LogDB } from '../../Modules/MongoDB/Models/Log'
import { UserDB } from '../../Modules/MongoDB/Models/User'
import { GuildDB } from '../../Modules/MongoDB/Models/Guild'
import { MemberDB } from '../../Modules/MongoDB/Models/Member'
import { EditedMessageDB } from '../../Modules/MongoDB/Models/EditedMessage'
import { DeletedMessageDB } from '../../Modules/MongoDB/Models/DeletedMessage'
import { Document, ObjectId } from 'mongoose';

export type BaseDoc<T> = Document<any, any, T> & T & {_id: ObjectId};

export type LogDoc = BaseDoc<LogDB>;
export type UserDoc = BaseDoc<UserDB>;
export type GuildDoc = BaseDoc<GuildDB>;
export type MemberDoc =  BaseDoc<MemberDB>;
export type EditedMessageDoc =  BaseDoc<EditedMessageDB>;
export type DeletedMessageDoc =  BaseDoc<DeletedMessageDB>;
