import { MessageEmbed } from 'discord.js';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';
import { GetMeme, Meme } from '../../Modules/APIs/Reddit';

const getEmbed = async (meme: Meme, config: Config) => {
    const embed = new MessageEmbed()
    .setColor(config.color)
    .setFooter(config.embed_footer)
    .setTitle(meme.title)
    .setAuthor('Fresh memes')
    
    if (meme.image.startsWith('https://i.redd.it/')) {
        embed.setImage(meme.image)
    }
    else {
        embed
            .setURL(meme.image)
            .setDescription(`[This is a video](${meme.image})`)
    }
    

    return embed;
}

const getFailEmbed = (config: Config) => new MessageEmbed().setColor(config.color).setTitle('API Unavailable.');

const command = new Command({
    name: 'meme',
    description: '😂',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        const sent_fetchingEmbed = message.channel.send({ embeds: [new MessageEmbed().setColor(client.config.color).setTitle('Fetching...')]});

        const api_req = GetMeme();

        const [sent, meme] = await Promise.all([sent_fetchingEmbed, api_req]);

        if (!meme) sent.edit({ embeds: [getFailEmbed(client.config)] });

        sent.edit({ embeds: [await getEmbed(meme, client.config)] })
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const meme = await GetMeme();
        if (!meme) interaction.followUp({ embeds: [getFailEmbed(client.config)] });

        interaction.followUp({ embeds: [await getEmbed(meme, client.config)] })
    }
}

export default command;