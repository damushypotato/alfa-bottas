import { Event } from '../Structures/Interfaces';

export const event: Event = {
    name: 'ready',
    once: true,
    async run(client) {
        console.log(`${client.user.tag} has entered the chat.`);
        client.user.setActivity('your mom', { type: 'PLAYING' });
        if (client.dev) {
            require('beeper')();
        }
    },
};
