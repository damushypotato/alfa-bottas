import { ApplicationCommandOptionType } from 'discord.js';
import { Time, Timezones } from '../../Modules/APIs/WorldTime';
import Command from '../../Structures/Command';

const api: { tzs: false | { raw: string; lc: string }[]; ready: boolean } = {
    ready: false,
    tzs: false,
};

Timezones.getTimezones().then(tzs => {
    api.ready = true;
    if (tzs) {
        api.tzs = tzs.map(t => {
            return {
                raw: t,
                lc: t.toLowerCase(),
            };
        });
    }
});

export default new Command({
    name: 'time',
    description: 'Get the current time in a timezone',
    ownerOnly: false,
    options: [
        {
            name: 'location',
            description: 'The location. It will autocomplete.',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
    ],
    memberPerms: [],
    autocomplete: async (client, interaction) => {
        const val = interaction.options.getString('location');

        if (!api.ready || !api.tzs) return interaction.respond([]);

        const choices = api.tzs;

        const filtered = choices
            .filter(choice => choice.lc.match(new RegExp(val, 'gi')))
            .slice(0, 25);

        interaction.respond(filtered.map(choice => ({ name: choice.raw, value: choice.lc })));
    },
    run: async (client, int, options, ctx, userCache, guildCache) => {
        if (!api.ready || !api.tzs) {
            return ctx.sendApiFailEmbed();
        }

        const location = options.getString('location').toLowerCase();

        const timezone = api.tzs.find(t => t.lc == location);

        if (!timezone)
            return ctx.sendEmbed(client.newEmbed({ title: 'That is not a valid timezone.' }));

        const time = await Time.getTime(timezone.raw);

        if (!time) return ctx.send({ embeds: [client.apiFailEmbed()] });

        const date = new Date();

        const dateOpts: Intl.DateTimeFormatOptions = {
            timeZone: timezone.raw,
        };

        const t = date.toLocaleTimeString('en-UK', dateOpts);
        const d = date.toLocaleDateString('en-UK', dateOpts);

        ctx.send({
            embeds: [
                client.newEmbed({
                    author: {
                        name: 'Time for:',
                    },
                    title: `${time.timezone} | (${time.abbreviation})`,
                    description: `\`${t.slice(0, 5)} - ${d}\``,
                }),
            ],
        });
    },
});
