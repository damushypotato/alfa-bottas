import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../Interfaces';

export const slashCommand: SlashCommand = {
    name: 'pfp',
    description: 'Shows someone\'s pfp',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'target',
            description: 'The user',
            type: 'USER',
            required: false
        }
    ],
    async run(client, interaction, options, data) {
        const target = options.getUser('target') || interaction.user;

        const embed = new MessageEmbed()
            .setTitle(`heres ur pfp`)
            .setDescription(`<@${target.id}>`)
            .setImage(`${target.displayAvatarURL()}?size=1024`)
            .setFooter(client.config.embed_footer)
            .setColor(client.config.color);

        interaction.followUp({ embeds: [embed] });
    }
}
