import { getSafeSeasons } from '.';
import Client from '../../../Structures/Client';
import { Session, GrandPrix } from 'formula1.js/dist/Types';

export namespace LastGP {
    export async function getEmbed(client: Client) {
        const seasons = await getSafeSeasons(-1);

        const sessions = [
            ...seasons[1].getAllSessions(),
            ...seasons[0].getAllSessions(),
        ];

        const last = sessions
            .filter(s => s.name == 'Race' && s.completed)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
        const gp = last.grandprix;
        const circuit = gp.circuit;

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
                    value: `*${circuit.name}* - \`${circuit.location.locality}, ${circuit.location.country}\``,
                },
            ],
        });

        return embed;
    }
}
