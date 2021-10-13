import { getCurrentSeasonRacesSchedule } from 'f1-api';
import { MessageEmbed } from 'discord.js';
import Client from '../../../Client';

export namespace NextGP {
    export async function getEmbed(client: Client) {
        const season = await getCurrentSeasonRacesSchedule();

        const now = Date.now();

        const gp = season.filter(r => r.date.getTime() - now >= 0)[0];

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
            .setAuthor('Next Grand Prix:')
            .setTitle(`${gp.season} ${gp.name} - Round ${gp.round}`)
            .addFields(
                {
                    name: 'When',
                    value: `<t:${Math.floor(gp.date.getTime() / 1000)}:R>`
                },
                {
                    name: 'Where',
                    value: `*${gp.circuit.name}* - \`${gp.circuit.location.city}, ${gp.circuit.location.country}\``
                }
            )

        return embed;
    }
}