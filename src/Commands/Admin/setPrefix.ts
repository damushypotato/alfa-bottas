import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

const maxLength = 8;

export default new Command({
    name: 'setprefix',
    description: 'Set the prefix for the server',
    memberPerms: ['Administrator'],
    options: [
        {
            name: 'prefix',
            description: 'The new prefix (max 8 characters)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'addspace',
            description: "Add a space after the prefix? (example prefix='bot ')",
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
    ],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const prefixInput = options.getString('prefix');
        const addSpace = options.getBoolean('addspace');

        let prefix = prefixInput.toLowerCase();

        if (prefix.length > maxLength) {
            return ctx.send(`Prefix must be shorter than ${maxLength} characters!`);
        }

        if (addSpace) prefix += ' ';

        if (prefix == guildCache.prefix) return ctx.send(`Prefix already set!`);

        const guildDB = await client.database.fetchGuildDB(int.guild);
        guildDB.prefix = prefix;
        await guildDB.save();
        client.database.cache.fetchAndUpdateGuild(guildDB);

        ctx.send(`The new prefix is set to \`${prefix}\` !`);
    },
});
