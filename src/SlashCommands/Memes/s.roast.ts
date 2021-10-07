import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../Structures/Interfaces';
import { GetRoast } from '../../Modules/APIs/Roast';

export const slashCommand: SlashCommand = {
    name: 'roast',
    description: 'u suck',
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const roast = await GetRoast();

        if (!roast) interaction.followUp({ embeds: [new MessageEmbed().setColor(client.config.color).setTitle('API Unavailable.')] });

        interaction.followUp(roast);
    }
}
