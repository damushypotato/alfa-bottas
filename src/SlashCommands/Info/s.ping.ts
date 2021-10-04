import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../Interfaces';

export const slashCommand: SlashCommand = {
    name: 'ping',
    description: 'Shows the bot\'s ping',
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const latencyPing = Math.floor(Date.now() - interaction.createdTimestamp);

        const pingEmbed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .addFields(
                { name: 'Bot Latency -', value: `${latencyPing}ms`, inline: true },
                { name: 'API Latency -', value: `${client.ws.ping}ms` , inline: true },
            )
            .setFooter(client.config.embed_footer);

        interaction.followUp({ embeds: [pingEmbed] });
    }
}
