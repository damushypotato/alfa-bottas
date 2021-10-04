import { Message } from 'discord.js';
import { Event } from '../Interfaces';

export const event: Event = {
    name: 'messageUpdate',
    once: false,
    async run(client, oldMessage: Message, newMessage: Message) {
        if (newMessage.author.bot) return;
        if (newMessage.channel.type != 'GUILD_TEXT') return;
        if (oldMessage.content == newMessage.content) return;
        await client.database.createEditedMessage(oldMessage, newMessage);
    }
}