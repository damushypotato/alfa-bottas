import { getCurrentSeasonRacesSchedule, getSeasonRacesSchedule } from 'f1-api';
import {} from 'discord.js';
import Client from '../../../Structures/Client';

export namespace LastGP {
    export async function getEmbed(client: Client) {
        const year = new Date().getFullYear();

        const s1 = await getSeasonRacesSchedule(year - 1);
        const s2 = await getSeasonRacesSchedule(year);

        const season = [...s1, ...s2];

        const now = Date.now();

        const gp = season.filter(r => r.date.getTime() - now < 0).at(-1);

        const embed = client.newEmbed({
            author: {
                name: 'Last Grand Prix:',
            },
            title: `${gp.season} ${gp.name} - Round ${gp.round}`,
            fields: [
                {
                    name: 'When',
                    value: `<t:${Math.floor(gp.date.getTime() / 1000)}:R>`,
                },
                {
                    name: 'Where',
                    value: `*${gp.circuit.name}* - \`${gp.circuit.location.city}, ${gp.circuit.location.country}\``,
                },
            ],
        });

        return embed;
    }
}
