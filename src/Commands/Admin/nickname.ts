import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'nickname',
    description: "Change a user's nickname.",
    ownerOnly: false,
    options: [
        {
            name: 'user',
            description: 'The user to nick.',
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'nickname',
            description: 'The new nickname.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    memberPerms: ['ManageNicknames'],
    run: async (client, interaction, options, ctx, userCache, guildCache) => {
        const target = interaction.guild.members.cache.get(options.getUser('user').id);

        if (!target) {
            return ctx.send('User not found.');
        }

        if (target.id == interaction.guild.ownerId)
            return ctx.send("Unable to change owner's nickname.");

        const nickInput = options.getString('nickname');

        if (nickInput.length > 32) {
            return ctx.send(
                'That nickname is too long. The nickname must be shorter than 32 characters.'
            );
        }

        if (nickInput == target.nickname) return ctx.send('Nickname already set!');

        await target.setNickname(nickInput);

        ctx.send(`Set ${target}'s nickname to \`${nickInput}\` !`);
    },
});
