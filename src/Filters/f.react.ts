import { EmojiResolvable } from 'discord.js';
import { Filter } from '../Structures/Interfaces';

export let ids: string[] = ['890940402641829899'];
export let emojis: EmojiResolvable[] = ['💩'];

export const filter: Filter = {
    name: 'sed',
    enabled: false,
    async evaluate(client, message) {
        if (ids.includes(message.author.id)) emojis.forEach((emoji) => message.react(emoji));
        return true;
    },
};
