import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'pfp',
    description: 'Profile picture of a user',
    ownerOnly: false,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target',
            description: 'The user whose pfp you want to get.',
            required: false,
        },
    ],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const target = options.getUser('target') || int.user;

        const embed = client.newEmbed({
            title: 'heres ur pfp',
            description: `<@${target.id}>`,
            image: {
                url: `${target.displayAvatarURL()}?size=1024`,
            },
        });

        ctx.sendEmbed(embed);
    },
});
