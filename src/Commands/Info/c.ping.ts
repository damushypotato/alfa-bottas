import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'ping',
    usage: 'ping',
    async run(client, message, args, data) {
        return await message.channel.send(`${client.ws.ping} ping!`)
    }
}
