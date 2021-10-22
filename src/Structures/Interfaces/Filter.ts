import Client from '../../Client';
import { Message } from 'discord.js';

interface Evaluate {
    (client: Client, message: Message): Promise<boolean>;
}

export interface Filter {
    name: string;
    evaluate: Evaluate;
}
