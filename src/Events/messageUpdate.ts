import { ChannelType, Message } from 'discord.js';
import { Event } from '../Types';

export const event: Event = {
    name: 'messageUpdate',
    once: false,
    async run(client, oldMessage: Message, newMessage: Message) {
        if (newMessage.author.bot) return;
        if (newMessage.channel.type != ChannelType.GuildText) return;
        if (oldMessage.content == newMessage.content) return;
        client.filters.find(f => f.name == 'lol')?.evaluate(client, newMessage);
        if (!client.services.editSnipe) return;
        await client.database.createEditedMessage(oldMessage, newMessage);
    },
};
