import { Filter } from '../Structures/Interfaces';

export let id = '890940402641829899';

export const filter: Filter = {
    name: 'sed',
    enabled: true,
    async evaluate(client, message) {
        if (message.author.id == id) message.react('💩');
        return true;
    },
};
