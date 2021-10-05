import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { GetQuote } from '../../Modules/Quote';

export const command: Command = {
    name: 'quote',
    description: 'An AI Generated quote',
    usage: 'quote',
    async run(client, message, args, data) {

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Generating...')
            .setColor(client.config.color);

        const sent_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] })

        const [msg, quote] = await Promise.all([sent_fetchingEmbed, GetQuote()]);

        if (!quote) msg.edit({ embeds: [new MessageEmbed().setColor(client.config.color).setTitle('API Unavailable.')] });

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
            .setTitle('An AI-Generated Quote')
            .setURL('https://inspirobot.me')
            .setImage(quote);

        msg.edit({ embeds: [embed] });
    }
}
