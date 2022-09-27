import {} from 'discord.js';
import Client from '../../../Structures/Client';

export namespace WCC {
    export async function getEmbed(client: Client) {
        const wcc = await client.api_cache.f1.fetchWCC_Cached(
            new Date().getFullYear(),
            undefined,
            25
        );

        const embed = client.newEmbed({
            title: `F1 ${wcc.season} Constructor Standings (as of Round ${wcc.completedRounds})`,
            fields: wcc.standings.map(c => {
                return {
                    name: `\`${c.position}\` - ${client.customEmojis.get(c.team.id)} *${
                        c.team.name
                    }*`,
                    value: `**${c.points}** point${c.points != 1 ? 's' : ''}${
                        c.wins > 0 ? ` | **${c.wins}** win${c.wins > 1 ? 's' : ''}` : ''
                    }`,
                };
            }),
        });

        return embed;
    }
}
