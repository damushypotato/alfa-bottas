import Command from '../../Modules/Command';

const command = new Command({
    name: 'pause',
    description: 'Pause the current track.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run({ player }, interaction, options, data) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: 'No music is currently being played',
            });

        queue.setPaused(true);

        interaction.followUp('Paused.');
    },
};

export default command;
