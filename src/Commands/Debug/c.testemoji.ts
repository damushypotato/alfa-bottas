import {  } from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'testemoji',
    description: 'The bot\'s custom emojis.',
});

command.textCommand = {
    usage: '<name>',
    async run(client, message, args, data) {
        message.channel.send(client.customEmojis.get(args[0]));
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: 'The name of the emoji to send'
        }
    ],
    async run(client, interaction, options, data) {
        const emoji = options.getString('name');
        interaction.followUp(client.customEmojis.get(emoji));
    }
}

export default command;