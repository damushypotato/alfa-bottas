import { MessageEmbed } from 'discord.js';
import Client from '../../Client';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';

const getEmbed = (createdTimestamp: number, client: Client) => {
    const latencyPing = Math.floor(Date.now() - createdTimestamp);

    const pingEmbed = new MessageEmbed()
        .setColor(client.config.color)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .addFields(
            { name: 'Bot Latency -', value: `${latencyPing}ms`, inline: true },
            { name: 'API Latency -', value: `${client.ws.ping}ms` , inline: true },
        )
        .setFooter(client.config.embed_footer);

    return pingEmbed;
}

const command = new Command({
    name: 'ping',
    description: 'Show the bot\'s ping.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        message.channel.send({ embeds: [getEmbed(message.createdTimestamp, client)] });
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp({ embeds: [getEmbed(interaction.createdTimestamp, client)] });
    }
}

export default command;