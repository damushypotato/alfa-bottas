import { Filter } from '../Types';

export let ids: string[] = ['625192842045685799'];

export const filter: Filter = {
    name: 'cool',
    enabled: false,
    async evaluate(client, message) {
        if (ids.includes(message.author.id)) message.react('🆒');
        return true;
    },
};
