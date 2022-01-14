import { MessageEmbed } from 'discord.js';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';
import { GetQuote } from '../../Modules/APIs/Quote';

const getEmbed = async (quote: string, config: Config) => {
    const embed = new MessageEmbed()
        .setColor(config.color)
        .setFooter(config.embed_footer)
        .setTitle('An AI-generated Quote')
        .setURL('https://inspirobot.me')
        .setImage(quote);

    return embed;
}

const getFailEmbed = (config: Config) => new MessageEmbed().setColor(config.color).setTitle('API Unavailable.');

const command = new Command({
    name: 'quote',
    description: 'An AI-generated quote.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        const quote = await GetQuote();
        if (!quote) message.channel.send({ embeds: [getFailEmbed(client.config)] });

        message.channel.send({ embeds: [await getEmbed(quote, client.config)] })
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const quote = await GetQuote();
        if (!quote) interaction.followUp({ embeds: [getFailEmbed(client.config)] });

        interaction.followUp({ embeds: [await getEmbed(quote, client.config)] })
    }
}

export default command;