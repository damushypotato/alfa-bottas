import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'slash',
    ownerOnly: true,
    usage: 'slash <register/unregister> <guild/global>',
    async run(client, message, [ action, scope ], data) {

        if (action != 'register' && action != 'unregister' ||
            scope != 'guild' && scope != 'global') {
            return message.channel.send('Usage: '+data.prefix+this.usage);
        }

        const embed = new MessageEmbed()
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer)
            .setTitle('In progress...')

        const sent = await message.channel.send({ embeds: [embed] });

        try {
            if (scope == 'global') {
                if (action == 'unregister') {
                    await client.unregisterAllSlashGlobal();
                }
                else {
                    await client.registerAllSlashGlobal();
                }
            }
            else {
                if (action == 'unregister') {
                    await client.unregisterAllSlashGuild(message.guildId);
                }
                else {
                    await client.registerAllSlashGuild(message.guildId);
                }
            }
        }
        catch {
            return sent.edit({ embeds: [new MessageEmbed(embed).setTitle('Unsuccessful: error occured')] });
        }

        sent.edit({ embeds: [new MessageEmbed(embed).setTitle('Done!')] });

    }
}
