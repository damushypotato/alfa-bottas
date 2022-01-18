import Command from '../../Modules/Command';

const command = new Command({
    name: 'stop',
    description: 'Stop playing and leave.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run({ player }, interaction, options, data) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp({
                content: 'No music is currently being played',
            });

        queue.destroy();

        interaction.followUp(`Leaving...`);
    },
};

export default command;
