import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'ping',
    description: "Test the bot's latency",
    ownerOnly: false,
    options: [],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const latencyPing = Math.floor(Date.now() - int.createdTimestamp);

        const embed = client.newEmbed({
            author: {
                name: client.user.username,
                iconURL: client.user.displayAvatarURL(),
            },
            fields: [
                { name: 'Bot Latency -', value: `${latencyPing}ms`, inline: true },
                {
                    name: 'API Latency -',
                    value: `${client.ws.ping}ms`,
                    inline: true,
                },
            ],
        });

        ctx.sendEmbed(embed);
    },
});

// import {} from 'discord.js';
// import Client from '../../Structures/Client';
// import Command from '../../Structures/Command';

// const getEmbed = (createdTimestamp: number, client: Client) => {

//     return pingEmbed;
// };
