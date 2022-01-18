import {} from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'activity',
    description: 'Do activites together.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            description: 'The voice channel to start the activity.',
            channelTypes: ['GUILD_VOICE'],
            required: true,
        },
        {
            name: 'activity',
            type: 'STRING',
            description: 'The activity to start.',
            choices: [
                {
                    name: 'YouTube',
                    value: 'youtube',
                },
                {
                    name: 'Poker',
                    value: 'poker',
                },
                {
                    name: 'Chess',
                    value: 'chess',
                },
                {
                    name: 'Betrayal',
                    value: 'betrayal',
                },
                {
                    name: 'Fishing',
                    value: 'fishing',
                },
                {
                    name: 'Letter Tile',
                    value: 'lettertile',
                },
                {
                    name: 'Words Snack',
                    value: 'wordsnack',
                },
                {
                    name: 'Doodle Crew',
                    value: 'doodlecrew',
                },
            ],
            required: true,
        },
    ],
    async run(client, interaction, options, data) {
        const channel = options.getChannel('channel');
        const activity = options.getString('activity');
        const invite = await client.discordTogether.createTogetherCode(
            channel.id,
            activity
        );

        if (!invite?.code) {
            return interaction.followUp('An error occured.');
        }

        interaction.followUp({
            embeds: [
                client.newEmbed({
                    title: `Started a new ${activity} session`,
                    description: `[Click to join!](${invite.code}) (🔊 ${channel.name})`,
                }),
            ],
        });
    },
};

export default command;
