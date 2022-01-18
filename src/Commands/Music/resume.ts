import Command from '../../Modules/Command';

const command = new Command({
    name: 'resume',
    description: 'Resume the current track.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run({ player }, interaction, options, data) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp('There is nothing playing.');

        queue.setPaused(false);

        interaction.followUp('Resumed.');
    },
};

export default command;
