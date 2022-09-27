import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'invite',
    description: 'Invite link for the bot',
    ownerOnly: false,
    options: [],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

        ctx.sendEmbed(
            client.newEmbed({
                author: {
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL(),
                },
                description: `To Invite Me To A Server, [Click Here!](${inviteURL})`,
            })
        );
    },
});
