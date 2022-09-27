import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'timeout',
    description: 'Timeout a user for a certain amount of time',
    ownerOnly: false,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'set',
            description: 'Set a timeout for a user.',
            options: [
                {
                    name: 'user',
                    description: 'The user to timeout.',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: 'duration',
                    description: 'The amount of time to timeout the user for. (in minutes)',
                    type: ApplicationCommandOptionType.Integer,
                    minValue: 1,
                    maxValue: 1440,
                    required: true,
                },
                {
                    name: 'reason',
                    required: false,
                    description: 'The reason for the timeout.',
                    type: ApplicationCommandOptionType.String,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'remove',
            description: 'Remove a timeout for a user.',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The user to remove the timeout from.',
                    required: true,
                },
            ],
        },
    ],
    memberPerms: ['Administrator'],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const command = options.getSubcommand() as 'set' | 'remove';

        if (command == 'set') {
            const target = int.guild.members.cache.get(options.getUser('user').id);

            if (!target) {
                return ctx.send('User not found.');
            }

            if (target.id == int.guild.ownerId) return ctx.send('Unable to timeout owner.');

            const duration = options.getInteger('duration');

            const reason = options.getString('reason');

            try {
                await target.timeout(duration * 60000, reason);
            } catch {
                return ctx.send('Unable to timeout user.');
            }

            ctx.send(
                `Timed out ${target} for ${duration} minute${duration != 1 ? 's' : ''}${
                    reason ? ` (${reason})` : ''
                }!`
            );
        } else {
            const target = int.guild.members.cache.get(options.getUser('user').id);

            try {
                await target.timeout(null, 'Remove timeout.');
            } catch {
                return ctx.send('Unable to remove timeout.');
            }

            ctx.send(`Removed timeout from ${target}!`);
        }
    },
});
