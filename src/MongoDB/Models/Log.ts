import { Schema, model } from 'mongoose';

export type LogType = 'Error' | 'Debug' | 'Generic' | 'Performance';

export interface LogDB {
    logType: LogType;
    title: string;
    message: string;
    time: number;
}

const schema = new Schema<LogDB>({
    logType: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: Number, required: true },
});

export const LogModel = model<LogDB>('Log', schema);
