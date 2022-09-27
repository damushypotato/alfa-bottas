import { ApplicationCommandOptionType, Emoji } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';

let emojis: string[];

const resetEmojis = (client: Client) => {
    emojis = client.customEmojis.emojis.map(e => e.name);
};

export default new Command({
    name: 'emoji',
    description: "The bot's custom emoji.",
    ownerOnly: false,
    options: [
        {
            name: 'name',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'The name of the emoji to send',
            autocomplete: true,
        },
    ],
    memberPerms: [],
    autocomplete: async (client, interaction) => {
        const val = interaction.options.getString('name');

        if (!emojis) resetEmojis(client);

        const filtered = emojis.filter(c => c.match(new RegExp(val, 'gi'))).slice(0, 25);

        interaction.respond(filtered.map(c => ({ name: c, value: c })));
    },
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const emoji = options.getString('name');

        if (emoji == '$reload') {
            client.customEmojis.setEmojis();
            resetEmojis(client);
            return ctx.send('Emojis Reloaded.');
        }

        ctx.send(client.customEmojis.get(emoji));
    },
});
