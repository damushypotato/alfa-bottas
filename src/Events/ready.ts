import { ActivityType } from 'discord.js';
import { Event } from '../Types';

export const event: Event = {
    name: 'ready',
    once: true,
    async run(client) {
        console.log(`${client.user.tag} has entered the chat.`);
        client.user.setActivity('with your mom', { type: ActivityType.Playing });
    },
};
