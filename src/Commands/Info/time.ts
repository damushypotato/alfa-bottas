import {} from 'discord.js';
import Command from '../../Modules/Command';
import { getTimezonesForCountry, getCountry } from 'countries-and-timezones';

const validOpts = ['country'] as const;
type Opts = typeof validOpts[number];

const command = new Command({
    name: 'time',
    description: 'Get time from different time zones',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'country',
            description: 'Get the timezone for a country.',
            options: [
                {
                    name: 'country_id',
                    description: 'The 2 digit country code.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],
    async run(client, interaction, options, data) {
        const sub = options.getSubcommand() as Opts;

        if (sub == 'country') {
            const cId = options.getString('country_id').toUpperCase();

            const country = getCountry(cId);
            const times = getTimezonesForCountry(cId);
            if (!times || !country) {
                return interaction.followUp('Invalid country code.');
            }

            const now = Date.now();

            const embed = client.newEmbed({
                description: `🕔 Timezones for ${country.name}:`,
                fields: times.map((tz) => {
                    const date = new Date(now + tz.dstOffset * 60000);

                    const time = [date.getUTCHours(), date.getUTCMinutes()];

                    return {
                        name: `Time in ${tz.name} -`,
                        value: `${time[0] > 12 ? time[0] - 12 : time[0]}:${
                            time[1]
                        } ${time[0] > 12 ? 'P.M.' : 'A.M.'}`,
                    };
                }),
            });

            interaction.followUp({ embeds: [embed] });
        }
    },
};

export default command;
