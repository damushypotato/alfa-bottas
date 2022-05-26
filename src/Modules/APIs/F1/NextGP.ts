import { getCurrentSeasonRacesSchedule, getSeasonRacesSchedule } from 'f1-api';
import {} from 'discord.js';
import Client from '../../../Structures/Client';
import { Session, GrandPrix } from 'formula1.js/dist/Types';
import { getSafeSeasons } from '.';

export namespace NextGP {
    export async function getEmbed(client: Client) {
        const seasons = await getSafeSeasons(1);

        const sessions: Session[] = [];
        const gps: GrandPrix[] = [];
        for (const season of seasons) {
            gps.push(...season.gps);
            for (const gp of season.gps) sessions.push(...gp.sessions);
        }

        const now = Date.now();
        const next = sessions
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .filter(s => s.date.getTime() - now >= 0)[0];

        //find the gp by id
        const gp = gps.find(g => next.id.endsWith(g.id));
        const race = gp.sessions.find(s => s.type === 'RACE');

        const embed = client.newEmbed({
            author: {
                name: 'Next Grand Prix:',
            },
            title: `${gp.season} ${gp.name} - Round ${gp.round}`,
            fields: [
                next.type !== 'RACE'
                    ? {
                          name: next.type,
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
                    value: `*${gp.circuit.name}* - \`${gp.circuit.location.locality}, ${gp.circuit.location.country}\``,
                },
            ].filter(Boolean),
        });

        return embed;
    }
}
