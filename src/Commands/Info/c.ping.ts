import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    description: 'Show the bot\'s ping',
    usage: 'ping',
    async run(client, message, args, data) {

        const pingingEmbed =  new MessageEmbed()
            .setTitle('Pinging...')
            .setColor(client.config.color);

        const time = Date.now();
        const sent = await message.channel.send({ embeds: [pingingEmbed] });

        let latencyPing = Math.floor(time - message.createdTimestamp);

        const pingEmbed = new MessageEmbed()
            .setColor(client.config.color)
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .addFields(
                { name: 'Bot Latency -', value: `${latencyPing}ms`, inline: true },
                { name: 'API Latency -', value: `${client.ws.ping}ms` , inline: true },
            )
            .setFooter(client.config.embed_footer);

        sent.edit({ embeds: [pingEmbed] });
    }
}
