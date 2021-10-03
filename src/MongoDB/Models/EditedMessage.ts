import { Schema, model } from 'mongoose';

export interface EditedMessageDB {
    member: Schema.Types.ObjectId;
    messageID: string;
    authorTag: string;
    authorID: string;
    guildName: string;
    guildID: string;
    channelName: string;
    channelID: string;
    oldContent: string;
    newContent: string;
    createdAt: number;
    editedAt: number;
}

const schema = new Schema<EditedMessageDB>({
    member: { type: Schema.Types.ObjectId, ref: 'Member', required: true },
    messageID: { type: String, required: true },
    authorTag: { type: String, required: true },
    authorID: { type: String, required: true },
    guildName: { type: String, required: true },
    guildID: { type: String, required: true },
    channelName: { type: String, required: true },
    channelID: { type: String, required: true },
    oldContent: { type: String, required: true },
    newContent: { type: String, required: true },
    createdAt: { type: Number, required: true },
    editedAt: { type: Number, required: true },
});

export const EditedMessageModel = model<EditedMessageDB>('EditedMessage', schema);
