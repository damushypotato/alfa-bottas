import { ApplicationCommandOptionType } from 'discord.js';
import { MapRotation, Stats } from '../../Modules/APIs/ApexLegends';
import Command from '../../Structures/Command';
import { ApexPlatform } from '../../Types';

const validCmd = ['stats', 'maps'] as const;
type Cmd = typeof validCmd[number];

export default new Command({
    name: 'apexlegends',
    description: 'Get Apex Legends stats',
    ownerOnly: false,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'stats',
            description: 'Get player stats.',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'platform',
                    description: 'PlayStation, Xbox or Origin',
                    choices: [
                        {
                            name: 'PlayStation',
                            value: 'PS4',
                        },
                        {
                            name: 'Xbox',
                            value: 'X1',
                        },
                        {
                            name: 'PC',
                            value: 'PC',
                        },
                    ],
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'username',
                    description: 'Your name on the chosen platform.',
                    required: true,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'maps',
            description: 'Get the current map rotations.',
        },
    ],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const command = options.getSubcommand() as Cmd;

        const token = client.secrets.API_KEYS.APEX;

        if (command == 'stats') {
            const platform = options.getString('platform') as ApexPlatform;
            const pId = options.getString('username');

            return ctx.send({
                embeds: [await Stats.getEmbed(platform, pId, token, client)],
            });
        }
        if (command == 'maps') {
            return ctx.send({
                embeds: await MapRotation.getEmbed(token, client),
                content: '**Current map rotations for Apex Legends:**',
            });
        }
    },
});
