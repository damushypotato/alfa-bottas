import { MessageEmbed, EmbedFieldData } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'services',
    description: 'Edit services',
    ownerOnly: true,
    usage: 'services [<service> <on | off>] | [--list] ',
    async run(client, message, [ service, status ], data) {

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

        if (status != 'on' && status != 'off' && status != '?' ||
            !keys.map(s => s.toLowerCase()).includes(service)) {
            return message.channel.send('Usage: '+data.prefix+this.usage);
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
