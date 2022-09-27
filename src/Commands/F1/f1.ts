import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command from '../../Structures/Command';
import { WDC, WCC, NextGP, LastGP } from '../../Modules/APIs/F1';

const validStat = ['wdc', 'wcc', 'next', 'last'] as const;
type Stat = typeof validStat[number];

export default new Command({
    name: 'f1',
    description: 'Formula 1 Stats',
    ownerOnly: false,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'wdc',
            description: 'The Driver standings.',
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'wcc',
            description: 'The Constructor standings.',
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'next',
            description: 'The next Formula 1 Grand Prix.',
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'last',
            description: 'The last Formula 1 Grand Prix.',
        },
    ],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const stat = options.getSubcommand() as Stat;

        switch (stat) {
            case 'wdc':
                return ctx.sendEmbed(await WDC.getEmbed(client));
            case 'wcc':
                return ctx.sendEmbed(await WCC.getEmbed(client));
            case 'next':
                return ctx.sendEmbed(await NextGP.getEmbed(client));
            case 'last':
                return ctx.sendEmbed(await LastGP.getEmbed(client));
        }
    },
});
