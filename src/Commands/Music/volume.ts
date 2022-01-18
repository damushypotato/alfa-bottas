import Command from '../../Modules/Command';

const command = new Command({
    name: 'volume',
    description: 'Set the volume.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'percentage',
            description: 'The volume to set between 1 and 100.',
            type: 'INTEGER',
        },
    ],
    async run({ player }, interaction, options, data) {
        const volumePercentage = options.getInteger('percentage');
        const queue = player.getQueue(interaction.guildId);
        if (!queue?.playing)
            return interaction.followUp('There is nothing playing.');

        if (!volumePercentage)
            return interaction.followUp(
                `The volume is at \`${queue.volume}%\``
            );

        const vol = Math.min(100, Math.max(1, volumePercentage));

        queue.setVolume(vol);

        return interaction.followUp({
            content: `Set the volume to \`${vol}%\``,
        });
    },
};

export default command;
