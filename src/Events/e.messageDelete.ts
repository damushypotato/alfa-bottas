import { Message } from 'discord.js';
import { Event } from '../Interfaces';
import * as DB from '../MongoDB'

export const event: Event = {
    name: 'messageDelete',
    once: false,
    async run(client, message: Message) {
        await DB.createDeletedMessage(message);
    }
}