import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'emoji',
    description: 'emoji test',
    ownerOnly: true,
    usage: 'emoji <name>',
    async run(client, message, args, data) {
        message.channel.send(client.customEmojis.get(args[0]));
    }
}
