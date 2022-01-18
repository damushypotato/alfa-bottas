import { GuildMember } from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'nowplaying',
    description: 'Shows info about the current song.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const { player } = client;
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: 'No music is currently being played',
            });

        const progressbar = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                {
                    title: 'Now Playing',
                    description: `🎶 | **${queue.current.title}**! (\`${timestamp.progress}%\`)`,
                    fields: [
                        {
                            name: '\u200b',
                            value: progressbar,
                        },
                    ],
                    color: client.config.color,
                    footer: {
                        text: `Queued by ${queue.current.requestedBy.tag}`,
                    },
                },
            ],
        });
    },
};

export default command;
