import Command from '../../Modules/Command';

const command = new Command({
    name: 'skip',
    description: 'Play the next song in the queue.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run({ player }, interaction, options, data) {
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp('There is nothing playing.');

        queue.skip();

        interaction.followUp(`Skipped.`);
    },
};

export default command;
