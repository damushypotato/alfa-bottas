import { EmbedFieldData, MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import { ClashProfile } from '../../Modules/ClashRoyale';

export const command: Command = {
    name: 'crprofile',
    description: 'Clash royale profile',
    aliases: ['crstats'],
    usage: 'crstats <#PLAYER_TAG>',
    async run(client, message, args, data) {
        if (!args[0]) return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        let tag = args[0].toUpperCase();

        if (!tag.startsWith('#')) tag = '#' + tag;

        const api_req = ClashProfile(tag, client.secrets.API_KEYS.CR);

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching data...')
            .setColor(client.config.color);

        const send_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] });

        const [profile, sent] = await Promise.all([api_req, send_fetchingEmbed]);

        if (!profile) return sent.edit({ embeds: [new MessageEmbed(fetchingEmbed).setTitle('Unable to find your profile.')] });

        const fields: EmbedFieldData[] = [
            { name: `Level`, value: profile.expLevel.toString(), inline: false },
            { name: `${profile.trophies} Trophies`, value: profile.arena.name, inline: false },
            { name: 'Wins', value: profile.wins.toString(), inline: false },
            { name: 'Losses', value: profile.losses.toString(), inline: false },
            { name: 'Three Crown Wins', value: profile.threeCrownWins.toString(), inline: false },
            { name: 'Total Donations', value: profile.totalDonations.toString(), inline: false },
            { name: `Clan`, value: profile.clan ? `${profile.clan?.name} - ${profile.role}` : 'No clan.', inline: false },
            { name: 'Deck', value: profile.currentDeck.map(x => x.name).join(' - '), inline: false },
            { name: 'Favourite card', value: profile.currentFavouriteCard?.name || 'None.', inline: false },
        ];

        const profileEmbed = new MessageEmbed()
            .setTitle(`Stats for ${profile.name || profile.tag}`)
            .setURL(`https://royaleapi.com/player/${encodeURIComponent(profile.tag)}`)
            .addFields(fields)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer);

        sent.edit({ embeds: [profileEmbed]});
    }
}
