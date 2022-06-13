import {} from 'discord.js';
import Command from '../../Structures/Command';
import { GetQuote } from '../../Modules/APIs/Quote';
import Client from '../../Structures/Client';

const getEmbed = async (quote: string, client: Client) => {
    const embed = client.newEmbed({
        title: 'An AI-generated Quote',
        url: 'https://inspirobot.me',
        image: {
            url: quote,
        },
    });

    return embed;
};

const command = new Command({
    name: 'quote',
    description: 'An AI-generated quote.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        const quote = await GetQuote();
        if (!quote) message.channel.send({ embeds: [client.apiFailEmbed()] });

        message.channel.send({ embeds: [await getEmbed(quote, client)] });
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const quote = await GetQuote();
        if (!quote) interaction.followUp({ embeds: [client.apiFailEmbed()] });

        interaction.followUp({ embeds: [await getEmbed(quote, client)] });
    },
};

export default command;
