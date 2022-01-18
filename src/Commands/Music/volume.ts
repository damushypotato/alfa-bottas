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
            return interaction.followUp({
                content: 'No music is currently being played',
            });

        if (!volumePercentage)
            return interaction.followUp({
                content: `The current volume is \`${queue.volume}%\``,
            });

        const vol = Math.min(100, Math.max(1, volumePercentage));

        queue.setVolume(vol);

        return interaction.followUp({
            content: `Volume has been set to \`${vol}%\``,
        });
    },
};

export default command;
