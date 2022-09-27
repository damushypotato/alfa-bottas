import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'services',
    description: "The client's services",
    ownerOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'set',
            description: 'Set a service.',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'service',
                    description: 'The service to set.',
                    choices: [
                        {
                            name: 'Commands',
                            value: 'commands',
                        },
                        {
                            name: 'Slash Commands',
                            value: 'slashcommands',
                        },
                        {
                            name: 'Snipes',
                            value: 'snipe',
                        },
                        {
                            name: 'Edit Snipes',
                            value: 'editsnipe',
                        },
                    ],
                    required: true,
                },
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'status',
                    description: 'Set the new status of the service',
                    choices: [
                        {
                            name: 'on',
                            value: 'on',
                        },
                        {
                            name: 'off',
                            value: 'off',
                        },
                    ],
                    required: true,
                },
            ],
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'list',
            description: 'List all services.',
        },
    ],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const keys = Object.keys(client.services);

        const action = options.getSubcommand();
        const service = options.getString('service');
        const status = options.getString('status');

        if (action == 'list') {
            return ctx.send({
                embeds: [
                    client.newEmbed(
                        {
                            title: 'Current Services Status:',
                            fields: keys.map(s => {
                                return {
                                    name: `*${s.toUpperCase()}*`,
                                    value: client.services[s] ? '`ON`' : '`OFF`',
                                    inline: true,
                                };
                            }),
                        },
                        true
                    ),
                ],
            });
        }

        const newStatus = status == 'on' ? true : status == 'off' ? false : null;

        client.services[keys.find(s => s.toLowerCase() == service)] = newStatus;
        ctx.send({
            embeds: [
                client.newEmbed({
                    title: `\`${service.toUpperCase()}\` is now \`${status.toUpperCase()}\``,
                }),
            ],
        });
    },
});
