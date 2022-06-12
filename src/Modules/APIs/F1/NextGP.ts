import Client from '../../../Structures/Client';
import { getSafeSeasons } from '.';
import { sessionType } from 'formula1.js/dist/Types';

export namespace NextGP {
    export async function getEmbed(client: Client) {
        const seasons = await getSafeSeasons(1);

        const next = seasons.map(s => s.findNextSession())[0];
        const gp = next.grandprix;
        const race = gp.sessions.race;
        const circuit = gp.circuit;

        const embed = client.newEmbed({
            author: {
                name: 'Next Grand Prix:',
            },
            title: `${gp.season} ${gp.name} - Round ${gp.round}`,
            fields: [
                next.name != 'Race'
                    ? {
                          name: next.name,
                          value: `<t:${Math.floor(
                              next.date.getTime() / 1000
                          )}:R>`,
                      }
                    : null,
                {
                    name: 'Race',
                    value: `<t:${Math.floor(race.date.getTime() / 1000)}:R>`,
                },
                {
                    name: 'Where',
                    value: `*${circuit.name}* - \`${circuit.location.locality}, ${circuit.location.country}\``,
                },
            ].filter(Boolean),
        });

        return embed;
    }
}
