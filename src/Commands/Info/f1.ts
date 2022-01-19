import {} from 'discord.js';
import Client from '../../Structures/Client';
import { WDC, WCC, NextGP, LastGP } from '../../Modules/APIs/F1';
import Command from '../../Structures/Command';

const validStat = ['wdc', 'wcc', 'next', 'last'] as const;
type Stat = typeof validStat[number];

const getStat = async (stat: Stat, client: Client) => {
    if (stat == 'wdc') {
        return await WDC.getEmbed(client);
    }
    if (stat == 'wcc') {
        return await WCC.getEmbed(client);
    }
    if (stat == 'next') {
        return await NextGP.getEmbed(client);
    }
    if (stat == 'last') {
        return await LastGP.getEmbed(client);
    }
};

const command = new Command({
    name: 'f1',
    description: 'Shows Formula 1 data.',
});

command.textCommand = {
    usage: '<next | last | wdc | wcc>',
    async run(client, message, [statIn], data) {
        const stat = statIn as Stat;
        if (!validStat.map((x) => x as string).includes(statIn))
            return command.sendUsage(message, data.prefix);

        const sent_fetchingEmbed = message.channel.send({
            embeds: [client.fetchingEmbed()],
        });
        const api_req = getStat(stat, client);

        const [sent, embed] = await Promise.all([sent_fetchingEmbed, api_req]);

        sent.edit({ embeds: [embed] });
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'wdc',
            description: 'The Driver standings.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'wcc',
            description: 'The Constructor standings.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'next',
            description: 'The next Formula 1 Grand Prix.',
        },
        {
            type: 'SUB_COMMAND',
            name: 'last',
            description: 'The last Formula 1 Grand Prix.',
        },
    ],
    async run(client, interaction, options, data) {
        const stat = options.getSubcommand() as Stat;

        interaction.followUp({ embeds: [await getStat(stat, client)] });
    },
};

export default command;
