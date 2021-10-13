import { getCurrentConstructorStandings } from 'f1-api';
import { EmbedFieldData, MessageEmbed } from 'discord.js';
import Client from '../../../Client';

export namespace WCC {
    export async function getEmbed(client: Client) {
        const wcc = await getCurrentConstructorStandings();
        console.log(wcc)

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
            .setTitle(`${wcc.season} Constructor Standings (as of Round ${wcc.round})`)
            .addFields(
                wcc.standings.map(c => {
                    return {
                        name: `\`${c.position}\` - ${client.customEmojis.get(c.constructor.id)} *${c.constructor.name}*`,
                        value: `**${c.points}** point${c.points != 1 ? 's' : ''}${c.wins > 0 ? ` | **${c.wins}** win${c.wins > 1 ? 's' : ''}` : ''}`
                    } as EmbedFieldData;
                })
            )

        return embed;
    }
}