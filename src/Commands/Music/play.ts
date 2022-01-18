import { GuildMember } from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'play',
    description: 'Play songs from YouTube in a voice channel.',
});

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
    async run({ player }, interaction, options, data) {
        const query = options.getString('search');
        const member = interaction.member as GuildMember;

        if (!member.voice.channel)
            return interaction.followUp({
                content: 'Join a voice channel first you dumbass.',
            });

        const track = (
            await player.search(query, {
                requestedBy: interaction.user,
            })
        ).tracks[0];

        const queue = player.createQueue(interaction.guild, {
            metadata: interaction.channel,
        });

        if (!queue.connection) await queue.connect(member.voice.channel);

        queue.addTrack(track);

        interaction.followUp({
            content: `${queue.playing ? 'Added to queue' : 'Playing'}: \`${
                track.title
            }\``,
        });

        if (!queue.playing) await queue.play();
    },
};

export default command;
