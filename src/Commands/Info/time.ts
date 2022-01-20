import {} from 'discord.js';
import Command from '../../Structures/Command';
import { Timezones, Time } from '../../Modules/APIs/WorldTime';

const api: { tzs: false | { raw: string; lc: string }[]; ready: boolean } = {
    ready: false,
    tzs: false,
};

Timezones.getTimezones().then((tzs) => {
    api.ready = true;
    if (tzs) {
        api.tzs = tzs.map((t) => {
            return {
                raw: t,
                lc: t.toLowerCase(),
            };
        });
    }
});

const command = new Command({
    name: 'time',
    description: 'Get time from different time zones',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'location',
            description: 'The location. It will autocomplete.',
            type: 'STRING',
            required: true,
            autocomplete: true,
        },
    ],
    async autocomplete(client, interaction) {
        const val = interaction.options.getString('location');

        if (!api.ready || !api.tzs) return interaction.respond([]);

        const choices = api.tzs;

        const filtered = choices
            .filter((choice) => choice.lc.match(new RegExp(val, 'gi')))
            .slice(0, 25);

        interaction.respond(
            filtered.map((choice) => ({ name: choice.raw, value: choice.lc }))
        );
    },
    async run(client, interaction, options, data) {
        if (!api.ready || !api.tzs) {
            return interaction.followUp({ embeds: [client.apiFailEmbed()] });
        }

        const location = options.getString('location').toLowerCase();

        const timezone = api.tzs.find((t) => t.lc == location);

        if (!timezone)
            return interaction.followUp({
                embeds: [
                    client.newEmbed({ title: 'That is not a valid timezone.' }),
                ],
            });

        const time = await Time.getTime(timezone.raw);

        if (!time)
            return interaction.followUp({ embeds: [client.apiFailEmbed()] });

        const date = new Date(time.datetime);

        const dateOpts: Intl.DateTimeFormatOptions = {
            timeZone: timezone.raw,
        };

        const t = date.toLocaleTimeString('en-UK', dateOpts);
        const d = date.toLocaleDateString('en-UK', dateOpts);

        interaction.followUp({
            embeds: [
                client.newEmbed({
                    author: {
                        name: 'Time for:',
                    },
                    title: `${time.timezone} | (${time.abbreviation})`,
                    description: `\`${t} - ${d}\``,
                }),
            ],
        });
    },
};

export default command;
