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

        const sent = await message.channel.send(`In progress...`)

        const allCommands = client.slashCommands.map(s => s);

        try {
            if (scope == 'global') {
                const { commands } = client.application;
                if (action == 'unregister') {
                    await commands.set([]);
                }
                else {
                    await commands.set(allCommands);
                }
            }
            else {
                const { commands } = client.guilds.cache.get(message.guildId);
                if (action == 'unregister') {
                    await commands.set([]);
                }
                else {
                    await commands.set(allCommands);
                }
            }
        }
        catch {
            return sent.edit('Unsuccessful: error occured');
        }

        sent.edit('Done!');

    }
}
