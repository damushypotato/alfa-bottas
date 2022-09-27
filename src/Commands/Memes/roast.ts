import { ApplicationCommandOptionType } from 'discord.js';
import { GetRoast } from '../../Modules/APIs/Roast';
import Command from '../../Structures/Command';

export default new Command({
    name: 'roast',
    description: 'Roasts you',
    ownerOnly: false,
    options: [],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const roast = await GetRoast();

        if (!roast) return ctx.sendApiFailEmbed();

        ctx.send(roast);
    },
});
