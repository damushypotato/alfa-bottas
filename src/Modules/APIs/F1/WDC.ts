import Client from '../../../Structures/Client';

export namespace WDC {
    export async function getEmbed(client: Client) {
        const wdc = await client.api_cache.f1.fetchWDC_Cached(
            new Date().getFullYear(),
            undefined,
            25
        );

        const embed = client.newEmbed({
            title: `F1 ${wdc.season} Driver Standings (as of Round ${wdc.completedRounds})`,
            fields: wdc.standings.map(d => {
                return {
                    name: `\`${d.position}\` - ${client.customEmojis.get(d.team.id)} *${
                        d.driver.firstName
                    } ${d.driver.lastName}* ${d.driver.permanentNumber}`,
                    value: `**${d.points}** point${d.points != 1 ? 's' : ''}${
                        d.wins > 0 ? ` | **${d.wins}** win${d.wins > 1 ? 's' : ''}` : ''
                    }`,
                };
            }),
        });

        return embed;
    }
}
