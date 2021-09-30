import { Schema, model } from 'mongoose';

export interface MemberDB {
    user: Schema.Types.ObjectId;
    guild: Schema.Types.ObjectId;
    registeredTime: number;
}

const schema = new Schema<MemberDB>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    guild: { type: Schema.Types.ObjectId, ref: 'Guild', required: true },
    registeredTime: { type: Number, required: true },
});

export const MemberModel = model<MemberDB>('Member', schema);
