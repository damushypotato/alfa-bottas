import { InteractionReplyOptions, MessageEditOptions, MessageEmbed, MessageOptions } from 'discord.js';
import { GetLyrics } from '../../Modules/APIs/Lyrics';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';
import { SongData } from '../../Types';

const lyricsEmbed = (client: ExtendedClient, data: SongData): MessageEmbed => {
    const lengthError = `\n\n**The lyrics are too long. To see the full lyrics, click [here](${data.links.genius}).**`;
    if (data.lyrics.length > 4096 - lengthError.length - 6) {
        return client.newEmbed({
            description: `${data.lyrics.slice(
                0,
                4096 - lengthError.length - 6
            )}${lengthError}`,
            title: `Lyrics for \`${data.title}\` by *${data.author}*`,
            image: {
                url: data.thumbnail.genius,
            },
            thumbnail: {
                url: data.thumbnail.genius,
            },
        });
    }

    return client.newEmbed({
        description: data.lyrics,
        title: `Lyrics for \`${data.title}\` by *${data.author}*`,
        image: {
            url: data.thumbnail.genius,
        },
        thumbnail: {
            url: data.thumbnail.genius,
        },
    });
};

const common = async (
    client: ExtendedClient,
    guildId: string,
    search?: string
): Promise<MessageOptions> => {
    if (search) {
        const data = await GetLyrics(search);

        if (!data)
            return {
                embeds: [client.newEmbed({ title: 'Unable to find lyrics.' })],
            };

        return { embeds: [lyricsEmbed(client, data)] };
    }

    const queue = client.player.getQueue(guildId);
    if (!queue?.playing)
        return { content: 'There is nothing playing.', embeds: [] };

    const data = await GetLyrics(queue.current.title);

    if (!data)
        return {
            embeds: [client.newEmbed({ title: 'Unable to find lyrics.' })],
        };

    return {
        embeds: [lyricsEmbed(client, data)],
    };
};

const command = new Command({
    name: 'lyrics',
    description: 'Show  lyrics.',
});

command.textCommand = {
    usage: '<search (optional)>',
    async run(client, message, args, { fullArgs }) {
        const sent = await message.channel.send({
            embeds: [client.fetchingEmbed()],
        });

        sent.edit(await common(client, message.guildId, fullArgs) as MessageEditOptions);
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'search',
            description: 'Search for other lyrics.',
        },
    ],
    async run(client, interaction, options, data) {
        interaction.followUp(
            await common(
                client,
                interaction.guildId,
                options.getString('search')
            ) as string | InteractionReplyOptions
        );
    },
};

export default command;
