import Command from '../../Structures/Command';

const command = new Command({
    name: 'timeout',
    description: 'Timeout a user for a set amount of time.',
    memberPerms: ['MUTE_MEMBERS'],
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'set',
            description: 'Set a timeout for a user.',
            options: [
                {
                    name: 'user',
                    description: 'The user to timeout.',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'duration',
                    description:
                        'The amount of time to timeout the user for. (in minutes)',
                    type: 'INTEGER',
                    minValue: 1,
                    maxValue: 1440,
                    required: true,
                },
                {
                    name: 'reason',
                    required: false,
                    description: 'The reason for the timeout.',
                    type: 'STRING',
                },
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'remove',
            description: 'Remove a timeout for a user.',
            options: [
                {
                    name: 'user',
                    type: 'USER',
                    description: 'The user to remove the timeout from.',
                    required: true,
                },
            ],
        },
    ],
    async run(client, interaction, options, data) {
        const command = options.getSubcommand() as 'set' | 'remove';

        if (command == 'set') {
            const target = interaction.guild.members.cache.get(
                options.getUser('user').id
            );

            if (!target) {
                return interaction.followUp('User not found.');
            }

            if (target.id == interaction.guild.ownerId)
                return interaction.followUp('Unable to timeout owner.');

            const duration = options.getInteger('duration');

            const reason = options.getString('reason');

            try {
                await target.timeout(duration * 60000, reason);
            } catch {
                return interaction.followUp('Unable to timeout user.');
            }

            interaction.followUp(
                `Timed out ${target} for ${duration} minute${
                    duration != 1 ? 's' : ''
                }${reason ? ` (${reason})` : ''}!`
            );
        } else {
            const target = interaction.guild.members.cache.get(
                options.getUser('user').id
            );

            try {
                await target.timeout(null, 'Remove timeout.');
            } catch {
                return interaction.followUp('Unable to remove timeout.');
            }

            interaction.followUp(`Removed timeout from ${target}!`);
        }
    },
};

export default command;
