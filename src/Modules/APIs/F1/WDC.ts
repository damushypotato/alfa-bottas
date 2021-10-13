import { getCurrentDriverStandings } from 'f1-api';
import { EmbedFieldData, MessageEmbed } from 'discord.js';
import Client from '../../../Client';

export namespace WDC {
    export async function getEmbed(client: Client) {
        const wdc = await getCurrentDriverStandings();

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
            .setTitle(`${wdc.season} Driver Standings (as of Round ${wdc.round})`)
            .addFields(
                wdc.standings.map(d => {
                    return {
                        name: `\`${d.position}${d.position > 20 ? ' 😂' : ''}\` - ${client.customEmojis.get(d.constructors[0].id)} *${d.driver.firstName} ${d.driver.lastName}* ${d.driver.number}`,
                        value: `**${d.points}** point${d.points != 1 ? 's' : ''}${d.wins > 0 ? ` | **${d.wins}** win${d.wins > 1 ? 's' : ''}` : ''}`
                    } as EmbedFieldData;
                })
            )

        return embed;
    }
}