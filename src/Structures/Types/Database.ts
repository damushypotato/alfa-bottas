import { LogDB } from '../../Modules/Database/Models/Log';
import { UserDB } from '../../Modules/Database/Models/User';
import { GuildDB } from '../../Modules/Database/Models/Guild';
import { MemberDB } from '../../Modules/Database/Models/Member';
import { EditedMessageDB } from '../../Modules/Database/Models/EditedMessage';
import { DeletedMessageDB } from '../../Modules/Database/Models/DeletedMessage';
import { Document, Types } from 'mongoose';

export type BaseDoc<T> = Document<any, any, T> & T & { _id: Types.ObjectId };

export type LogDoc = BaseDoc<LogDB>;
export type UserDoc = BaseDoc<UserDB>;
export type GuildDoc = BaseDoc<GuildDB>;
export type MemberDoc = BaseDoc<MemberDB>;
export type EditedMessageDoc = BaseDoc<EditedMessageDB>;
export type DeletedMessageDoc = BaseDoc<DeletedMessageDB>;
