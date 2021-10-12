import { MessageMentions } from 'discord.js';
import Client from '../../Client';

//? https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#parsing-mentions

export const getUserFromMention = (mention: string, client: Client) => {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(MessageMentions.USERS_PATTERN);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // The first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    let id = matches[0];

    id = id.slice(2, -1);

    if (id.startsWith('!')) {
        id = id.slice(1);
    }

    return client.users.cache.get(id);
}