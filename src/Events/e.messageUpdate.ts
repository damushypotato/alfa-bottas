import { Message } from 'discord.js';
import { Event } from '../Interfaces';
import * as DB from '../MongoDB'

export const event: Event = {
    name: 'messageUpdate',
    once: false,
    async run(client, oldMessage: Message, newMessage: Message) {
        if (newMessage.author.bot) return;
        if (newMessage.channel.type != 'GUILD_TEXT') return;
        await DB.createEditedMessage(oldMessage, newMessage);
    }
}