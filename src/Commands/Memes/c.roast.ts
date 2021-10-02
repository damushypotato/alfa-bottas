import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { GetRoast } from '../../Modules/Roast';

export const command: Command = {
    name: 'roast',
    usage: 'insult',
    async run(client, message, args, data) {

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Generating...')
            .setColor(client.config.color);

        const sent_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] })

        const [msg, roast] = await Promise.all([sent_fetchingEmbed, GetRoast()]);

        if (!roast) msg.edit({ embeds: [new MessageEmbed().setColor(client.config.color).setTitle('API Unavailable.')] });

        msg.edit({ content: roast, embeds: [] });
    }
}
