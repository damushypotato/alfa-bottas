import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { SlashCommand } from '../../Interfaces';
import { ClashProfile, ClashChests, ClashWarWeek } from '../../Modules/ClashRoyale';

export const slashCommand: SlashCommand = {
    name: 'clashstats',
    description: 'Clash royale commands',
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'player',
            description: 'Gets CR stats for a player',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The player #TAG',
                    required: true
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'chests',
            description: 'Gets CR upcoming chests for a player',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The player #TAG',
                    required: true
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'war',
            description: 'Gets CR clan war standings',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The clan #TAG (type \'$\' for Daddy Hasbulla)',
                    required: true
                }
            ],
        },
    ],
    async run(client, interaction, [ command ], data) {

        const stat = command.name;

        let tag = (command.options[0].value as string).toUpperCase();
        
        if (!tag.startsWith('#') && tag != '$') tag = '#' + tag;

        if (stat == 'war') {

            if (tag == '$') tag = '#L2JL9YUR';

            const war = await ClashWarWeek(tag, client.secrets.API_KEYS.CR);

            if (!war) return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Unable to find clan war data.')
                .setColor(client.config.color)
            ]});

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
            return interaction.followUp({ embeds: [warEmbed] });
        }
        else if (stat == 'player') {

            const profile = await ClashProfile(tag, client.secrets.API_KEYS.CR);

            if (!profile) return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Unable to find profile data.')
                .setColor(client.config.color)
            ]});

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

            return interaction.followUp({ embeds: [profileEmbed] });
        }
        else if (stat == 'chests') {

            const chests = await ClashChests(tag, client.secrets.API_KEYS.CR);

            if (!chests) return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Unable to find chest data.')
                .setColor(client.config.color)
            ]});

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

            return interaction.followUp({ embeds: [chestsEmbed] });
        }
        else {
            return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Unknown stat type.')
                .setColor(client.config.color)
            ]});
        }
    }
}
