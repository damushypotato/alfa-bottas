import { ApplicationCommandOptionType } from 'discord.js';
import { GetQuote } from '../../Modules/APIs/Quote';
import Command from '../../Structures/Command';

export default new Command({
    name: 'quote',
    description: 'An AI generated quote',
    ownerOnly: false,
    options: [],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const quote = await GetQuote();

        if (!quote) return ctx.sendApiFailEmbed();

        const embed = client.newEmbed({
            title: 'An AI-generated Quote',
            url: 'https://inspirobot.me',
            image: {
                url: quote,
            },
        });

        ctx.sendEmbed(embed);
    },
});
