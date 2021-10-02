import { EmbedFieldData, MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import { ClashChests } from './../../Modules/ClashRoyale'

export const command: Command = {
    name: 'crchests',
    aliases: ['crchest'],
    usage: 'crchest <#PLAYER_TAG>',
    async run(client, message, args, data) {
        if (!args[0]) return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        let tag = args[0].toUpperCase();

        if (!tag.startsWith('#')) tag = '#' + tag;

        const api_req = ClashChests(tag, client.secrets.API_KEYS.CR);

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching data...')
            .setColor(client.config.color);

        const send_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] });

        const [chests, sent] = await Promise.all([api_req, send_fetchingEmbed]);

        if (!chests) return sent.edit({ embeds: [new MessageEmbed(fetchingEmbed).setTitle('Unable to find your profile.')] });

        const chestsEmbed = new MessageEmbed()
            .setTitle(`Upcoming chests for ${tag}`)
            .setURL(`https://royaleapi.com/player/${encodeURIComponent(tag)}`)
            .addFields(chests.items.map(c => {
                return {
                    name: c.name,
                    value: c.index == 0 ? 'Next' : `+${c.index}`
                } as EmbedFieldData;
            }))
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)

        sent.edit({ embeds: [chestsEmbed] });
    }
}
