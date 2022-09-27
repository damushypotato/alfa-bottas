import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'op',
    description: 'Set OP status for a user.',
    ownerOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to set OP status for.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'status',
            description: 'The status to set for the user.',
            type: ApplicationCommandOptionType.Boolean,
            required: true,
        },
    ],
    run: async (client, interaction, options, ctx, userCache, guildCache) => {
        const target = options.getUser('user');

        if (!target) {
            return ctx.send('User not found.');
        }

        const opStatus = options.getBoolean('op');

        const userDB = await client.database.fetchUserDB(target);

        if (opStatus == null) {
            return ctx.send(`${target} is ${userDB.OP ? '' : 'not '}OP.`);
        }

        if (opStatus == userDB.OP) return ctx.send(`Already set!`);

        userDB.OP = opStatus;

        await userDB.save();

        client.database.cache.fetchAndUpdateUser(userDB);

        ctx.send(`${target} now set to ${userDB.OP ? '' : 'not '}OP.`);
    },
});
