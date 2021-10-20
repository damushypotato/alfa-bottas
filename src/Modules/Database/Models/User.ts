import { Schema, model } from 'mongoose';

export interface UserDB {
    id: string;
    tag: string;
    OP?: boolean;
    registeredTime: number;
}

const schema = new Schema<UserDB>({
    id: { type: String, required: true },
    tag: { type: String, required: true },
    OP: { type: Boolean, required: false, default: false },
    registeredTime: { type: Number, required: true },
});

export const UserModel = model<UserDB>('User', schema);
