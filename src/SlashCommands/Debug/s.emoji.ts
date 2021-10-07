import {  } from 'discord.js';
import { SlashCommand } from '../../Structures/Interfaces';

export const slashCommand: SlashCommand = {
    name: 'emoji',
    description: 'sends an emoji from the bot\'s custom emojis',
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
