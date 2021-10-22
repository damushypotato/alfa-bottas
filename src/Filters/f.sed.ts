import { Filter } from '../Structures/Interfaces';

export let id: string[] = ['890940402641829899'];

export const filter: Filter = {
    name: 'sed',
    enabled: true,
    async evaluate(client, message) {
        if (id.includes(message.author.id)) message.react('💩');
        return true;
    },
};
