import Command from '../../Modules/Command';
import { MessageEmbed } from 'discord.js';
import { Stats } from '../../Modules/APIs/ApexLegends';
import { Config } from '../../Structures/Interfaces';
import { ApexPlatform } from '../../Structures/Types';

const command = new Command({
    name: 'apexstats',
    description: 'Stats for Apex Legends',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'platform',
            description: 'PlayStation, Xbox or Origin',
            choices: [
                {
                    name: 'PlayStation',
                    value: 'psn',
                },
                {
                    name: 'Xbox',
                    value: 'xbl',
                },
                {
                    name: 'Origin',
                    value: 'origin',
                },
            ],
            required: true,
        },
        {
            type: 'STRING',
            name: 'username',
            description: 'Your name on the chosen platform.',
            required: true,
        },
    ],
    async run(client, interaction, options, data) {
        const platform = options.getString('platform') as ApexPlatform;
        const pId = options.getString('username');

        const token = client.secrets.API_KEYS.TRN;

        interaction.followUp({ embeds: [await Stats.getEmbed(platform, pId, token, client.config)] });
    },
};

export default command;
