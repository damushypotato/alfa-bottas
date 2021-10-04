import { Message } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'messageDelete',
    once: false,
    async run(client, message: Message) {
        if (message.author.id == client.user.id) return;
        if (message.channel.type != 'GUILD_TEXT') return;
        await client.database.createDeletedMessage(message);
    }
}