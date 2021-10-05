import { EmbedFieldData, MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import { ClashWarWeek } from './../../Modules/ClashRoyale'

export const command: Command = {
    name: 'crwarweek',
    description: 'Clash royale clan war standings',
    aliases: ['crwar', 'crrace', 'crriverrace'],
    usage: 'crwarweek <#CLAN_TAG>',
    async run(client, message, args, data) {
        if (!args[0]) return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        let tag = args[0].toUpperCase();

        if (tag == '$') tag = '#L2JL9YUR';
        
        if (!tag.startsWith('#')) tag = '#' + tag;

        const api_req = ClashWarWeek(tag, client.secrets.API_KEYS.CR);

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching data...')
            .setColor(client.config.color);

        const send_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] });

        const [war, sent] = await Promise.all([api_req, send_fetchingEmbed]);

        if (!war) return sent.edit({ embeds: [new MessageEmbed(fetchingEmbed).setTitle('Unable to find clan war data.')] });

        const warEmbed = new MessageEmbed()
            .setTitle(`Current war for ${war.clan.name}`)
            .setURL(`https://royaleapi.com/clan/${encodeURIComponent(war.clan.tag)}`)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer);

        const clanStandings = war.clans.sort((a, b) => b.fame - a.fame);

        if (war.periodType == 'colosseum') {
            warEmbed.addFields(clanStandings.map((c, i) => {
                return {
                    name: `#${i+1} - ${c.name}`,
                    value: `${c.fame} points`
                } as EmbedFieldData;
            }))
        }
        else {
            warEmbed.addFields(clanStandings.map((c, i) => {
                return {
                    name: `#${i+1} - ${c.name} - ${c.fame} points`,
                    value: `${c.periodPoints} medals today`
                } as EmbedFieldData;
            }))
        }

        sent.edit({ embeds: [warEmbed] });
    }
}
