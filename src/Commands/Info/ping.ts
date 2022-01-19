import {} from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';

const getEmbed = (createdTimestamp: number, client: Client) => {
    const latencyPing = Math.floor(Date.now() - createdTimestamp);

    const pingEmbed = client.newEmbed({
        author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
        },
        fields: [
            { name: 'Bot Latency -', value: `${latencyPing}ms`, inline: true },
            {
                name: 'API Latency -',
                value: `${client.ws.ping}ms`,
                inline: true,
            },
        ],
    });

    return pingEmbed;
};

const command = new Command({
    name: 'ping',
    description: "Show the bot's ping.",
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        message.channel.send({
            embeds: [getEmbed(message.createdTimestamp, client)],
        });
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp({
            embeds: [getEmbed(interaction.createdTimestamp, client)],
        });
    },
};

export default command;
