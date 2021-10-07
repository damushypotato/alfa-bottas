import {  } from 'discord.js';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'test',
    description: 'test command'
});

command.textCommand = {
    usage: 'test',
    async run(client, message, args, data) {
        message.channel.send('tested text');
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp('tested slash');
    }
}

export default command;