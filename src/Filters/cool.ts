import { Filter } from '../Structures/Interfaces';

export let ids: string[] = ['625192842045685799'];

export const filter: Filter = {
    name: 'cool',
    enabled: true,
    async evaluate(client, message) {
        if (ids.includes(message.author.id)) message.reply('cool.');
        return true;
    },
};
