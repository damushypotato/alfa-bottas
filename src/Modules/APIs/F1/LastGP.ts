import { getSafeSeasons } from '.';
import Client from '../../../Structures/Client';
import { Session, GrandPrix } from 'formula1.js/dist/Types';

export namespace LastGP {
    export async function getEmbed(client: Client) {
        const seasons = await getSafeSeasons(-1);

        //add all races and gps to an array
        const races: Session[] = [];
        const gps: GrandPrix[] = [];
        for (const season of seasons) {
            gps.push(...season.gps);
            for (const gp of season.gps)
                races.push(gp.sessions.find(s => s.type === 'RACE'));
        }
        //find the past race
        const now = Date.now();
        const last = races
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .filter(s => s.date.getTime() - now <= 0)[0];

        //find the gp by id
        const gp = gps.find(g => last.id.endsWith(g.id));

        const embed = client.newEmbed({
            author: {
                name: 'Last Grand Prix:',
            },
            title: `${gp.season} ${gp.name} - Round ${gp.round}`,
            fields: [
                {
                    name: 'When',
                    value: `<t:${Math.floor(last.date.getTime() / 1000)}:R>`,
                },
                {
                    name: 'Where',
                    value: `*${gp.circuit.name}* - \`${gp.circuit.location.locality}, ${gp.circuit.location.country}\``,
                },
            ],
        });

        return embed;
    }
}
