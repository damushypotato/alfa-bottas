import { MessageEmbed, EmbedFieldData } from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'services',
    description: 'The client\'s services.',
    ownerOnly: true,
});

command.textCommand = {
    usage: '[<service> <on | off> || --list]',
    async run(client, message, [service, status], data) {
        const keys = Object.keys(client.services);

        if (service == '--list') {
            return message.channel.send({ embeds: [new MessageEmbed()
                .setTitle('Current Services Status:')
                .setColor(client.config.color)
                .setFooter(client.config.embed_footer)
                .addFields(keys.map(s => {
                    return {
                        name: `*${s.toUpperCase()}*`,
                        value: client.services[s] ? '`ON`' : '`OFF`',
                        inline: true
                    } as  EmbedFieldData;
                }))
            ] });
        }

        if (status != 'on' && status != 'off' ||
            !keys.map(s => s.toLowerCase()).includes(service)) {
            return command.sendUsage(message, data.prefix);
        }

        const newStatus = status == 'on' ? true : status == 'off' ? false : null;

        client.services[keys.find(s => s.toLowerCase() == service)] = newStatus;
        message.channel.send({ embeds: [new MessageEmbed()
            .setTitle(`\`${service.toUpperCase()}\` is now \`${status.toUpperCase()}\``)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
        ] });
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'set',
            description: 'Set a service.',
            options: [
                {
                    type: 'STRING',
                    name: 'service',
                    description: 'The service to set.',
                    choices: [
                        {
                            name: 'Commands',
                            value: 'commands'
                        },
                        {
                            name: 'Slash Commands',
                            value: 'slashcommands'
                        },
                        {
                            name: 'Snipes',
                            value: 'snipe'
                        },
                        {
                            name: 'Edit Snipes',
                            value: 'editsnipe'
                        },
                    ],
                    required: true
                },
                {
                    type: 'STRING',
                    name: 'status',
                    description: 'Set the new status of the service',
                    choices: [
                        {
                            name: 'on',
                            value: 'on'
                        },
                        {
                            name: 'off',
                            value: 'off'
                        }
                    ],
                    required: true
                }
            ]
        },
        {
            type: 'SUB_COMMAND',
            name: 'list',
            description: 'List all services.'
        }
    ],
    async run(client, interaction, options, data) {
        const keys = Object.keys(client.services);

        const action = options.getSubcommand();
        const service = options.getString('service');
        const status  = options.getString('status');

        if (action == 'list') {
            return interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Current Services Status:')
                .setColor(client.config.color)
                .setFooter(client.config.embed_footer)
                .addFields(keys.map(s => {
                    return {
                        name: `*${s.toUpperCase()}*`,
                        value: client.services[s] ? '`ON`' : '`OFF`',
                        inline: true
                    } as  EmbedFieldData;
                }))
            ] });
        }

        const newStatus = status == 'on' ? true : status == 'off' ? false : null;

        client.services[keys.find(s => s.toLowerCase() == service)] = newStatus;
        interaction.followUp({ embeds: [new MessageEmbed()
            .setTitle(`\`${service.toUpperCase()}\` is now \`${status.toUpperCase()}\``)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
        ] });
    }
}

export default command;