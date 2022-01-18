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
            return interaction.followUp('There is nothing playing.');

        const progressbar = queue.createProgressBar();
        const timestamp = queue.getPlayerTimestamp();

        return interaction.followUp({
            embeds: [
                client.newEmbed({
                    title: 'Now Playing',
                    description: `🎶 | **${queue.current.title}** (\`${timestamp.progress}%\`)\n${progressbar}`,
                    footer: {
                        text: `Queued by ${queue.current.requestedBy.tag}`,
                    },
                }),
            ],
        });
    },
};

export default command;
