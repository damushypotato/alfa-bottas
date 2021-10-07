import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { SlashCommand } from '../../Structures/Interfaces';
import { Profile, War, Chests, HashtagHelper } from '../../Modules/APIs/ClashRoyale';

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
    async run(client, interaction, options, data) {

        const stat = options.getSubcommand();

        let tag = options.getString('tag').toUpperCase();
        
        if (tag != '$') {
            tag = '#' + HashtagHelper.normalizeHashtag(tag);

            if (!HashtagHelper.isValidHashtag(tag)) {
                return interaction.followUp('Thats not a real hashtag yo');
            }
        }
        
        const token = client.secrets.API_KEYS.CR;
        const { config } = client;
        
        if (stat == 'war') {
            interaction.followUp({ embeds: [await War.getEmbed(tag, token, config)] });
        }
        else if (stat == 'player') {
            interaction.followUp({ embeds: [await Profile.getEmbed(tag, token, config)] });
        }
        else if (stat == 'chests') {
            interaction.followUp({ embeds: [await Chests.getEmbed(tag, token, config)] });
        }
        else {
            return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Unknown stat.')
                .setColor(client.config.color)
            ]});
        }
    }
}
