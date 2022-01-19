import { Schema, model } from 'mongoose';

export interface GuildDB {
    id: string;
    name: string;
    prefix?: string;
    lastMemberCount: number;
    registeredTime: number;
}

const schema = new Schema<GuildDB>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    prefix: { type: String, required: false },
    lastMemberCount: { type: Number, required: true },
    registeredTime: { type: Number, required: true },
});

export const GuildModel = model<GuildDB>('Guild', schema);
