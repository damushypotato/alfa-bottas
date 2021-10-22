import { Emoji } from 'discord.js';
import { Filter } from '../Structures/Interfaces';

export let ids: string[] = ['890940402641829899'];
export let emoji: string = '💩';

export const filter: Filter = {
    name: 'sed',
    enabled: true,
    async evaluate(client, message) {
        if (ids.includes(message.author.id)) message.react(emoji);
        return true;
    },
};
