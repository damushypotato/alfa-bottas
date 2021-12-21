import Command from '../../Modules/Command';
import { Stats, MapRotation } from '../../Modules/APIs/ApexLegends';
import { ApexPlatform } from '../../Structures/Types';
import { Config } from '../../Structures/Interfaces';

const validCmd = ['stats', 'maps'] as const;
type Cmd = typeof validCmd[number];

const command = new Command({
    name: 'apexlegends',
    description: 'Apex Legends Stats and Info',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'stats',
            description: 'Get player stats.',
            options: [
                {
                    type: 'STRING',
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
                    type: 'STRING',
                    name: 'username',
                    description: 'Your name on the chosen platform.',
                    required: true,
                },
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'maps',
            description: 'Get the current map rotations.',
        },
    ],
    async run(client, interaction, options, data) {
        const command = options.getSubcommand() as Cmd;

        const token = client.secrets.API_KEYS.APEX;

        if (command == 'stats') {
            const platform = options.getString('platform') as ApexPlatform;
            const pId = options.getString('username');

            return interaction.followUp({ embeds: [await Stats.getEmbed(platform, pId, token, client.config)] });
        }
        if (command == 'maps') {
            return interaction.followUp({
                embeds: await MapRotation.getEmbed(token, client.config),
                content: '**Current map rotations for Apex Legends:**',
            });
        }
    },
};

export default command;
