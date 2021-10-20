import { Schema, model } from 'mongoose';

export interface DeletedMessageDB {
    member: Schema.Types.ObjectId;
    authorTag: string;
    authorID: string;
    guildName: string;
    guildID: string;
    channelName: string;
    channelID: string;
    content: string;
    createdAt: number;
    deletedAt: number;
    attachments: string[];
}

const schema = new Schema<DeletedMessageDB>({
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    authorTag: { type: String, required: true },
    authorID: { type: String, required: true },
    guildName: { type: String, required: true },
    guildID: { type: String, required: true },
    channelName: { type: String, required: true },
    channelID: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Number, required: true },
    deletedAt: { type: Number, required: true },
    attachments: { type: [String], required: false },
});

export const DeletedMessageModel = model<DeletedMessageDB>('DeletedMessage', schema);
