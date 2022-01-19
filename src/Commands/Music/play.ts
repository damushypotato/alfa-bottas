import { Track } from 'discord-player';
import {
    Guild,
    GuildMember,
    MessageOptions,
    TextBasedChannel,
    VoiceBasedChannel,
} from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = async (
    client: ExtendedClient,
    guild: Guild,
    channel: TextBasedChannel,
    vc: VoiceBasedChannel,
    track: Track
): Promise<MessageOptions> => {
    if (guild.me.voice.channelId && vc.id !== guild.me.voice.channelId) {
        return {
            embeds: [
                client.newEmbed({
                    title: '🚫 You are not in my voice channel.',
                }),
            ],
        };
    }

    const queue = client.player.createQueue(guild, {
        metadata: channel,
    });

    try {
        if (!queue.connection) await queue.connect(vc);
    } catch {
        queue.destroy();
        return {
            embeds: [
                client.newEmbed({
                    title: '❌ Could not join your voice channel.',
                }),
            ],
        };
    }

    queue.addTrack(track);

    if (!queue.playing) queue.play();

    return {
        content: `${track.url}\n${
            queue.playing ? '✅ Added to queue' : '🎶 Playing'
        }: \`${track.title}\``,
        embeds: [],
    };
};

const command = new Command({
    name: 'play',
    description: 'Play songs from YouTube in a voice channel.',
});

command.textCommand = {
    usage: '<song title>',
    async run(client, message, args, data) {
        const { player } = client;
        const query = data.fullArgs;
        const member = message.member;

        if (!member.voice.channel)
            return message.channel.send(
                'Join a voice channel first you dumbass.'
            );

        const sent_fetchingEmbed = message.channel.send({
            embeds: [client.fetchingEmbed()],
        });

        const req = player.search(query, {
            requestedBy: message.author,
        });

        const [sent, result] = await Promise.all([sent_fetchingEmbed, req]);

        const track = result.tracks[0];

        sent.edit(
            await common(
                client,
                message.guild,
                message.channel,
                message.member.voice.channel,
                track
            )
        );
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'STRING',
            name: 'search',
            description: 'The song to search for.',
            required: true,
        },
    ],
    async run(client, interaction, options, data) {
        const { player } = client;
        const query = options.getString('search');
        const member = interaction.member as GuildMember;

        if (!member.voice.channel)
            return interaction.followUp(
                'Join a voice channel first you dumbass.'
            );

        const track = (
            await player.search(query, {
                requestedBy: interaction.user,
            })
        ).tracks[0];

        interaction.followUp(
            await common(
                client,
                interaction.guild,
                interaction.channel,
                member.voice.channel,
                track
            )
        );
    },
};

export default command;
