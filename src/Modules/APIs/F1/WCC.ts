import { getCurrentConstructorStandings } from 'f1-api';
import {} from 'discord.js';
import Client from '../../../Client';

export namespace WCC {
    export async function getEmbed(client: Client) {
        const wcc = await getCurrentConstructorStandings();

        const embed = client.newEmbed({
            title: `${wcc.season} Constructor Standings (as of Round ${wcc.round})`,
            fields: wcc.standings.map((c) => {
                return {
                    name: `\`${c.position}\` - ${client.customEmojis.get(
                        c.constructor.id
                    )} *${c.constructor.name}*`,
                    value: `**${c.points}** point${c.points != 1 ? 's' : ''}${
                        c.wins > 0
                            ? ` | **${c.wins}** win${c.wins > 1 ? 's' : ''}`
                            : ''
                    }`,
                };
            }),
        });

        return embed;
    }
}
