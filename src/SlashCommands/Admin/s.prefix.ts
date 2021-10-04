import {  } from 'discord.js';
import { SlashCommand } from '../../Interfaces';

export const slashCommand: SlashCommand = {
    name: 'setprefix',
    description: 'Set the guild prefix',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'prefix',
            description: 'The new prefix (max 8 characters)',
            type: 'STRING',
            required: true
        },
        {
            name: 'addspace',
            description: 'Add a space after the prefix? (example prefix=\'bot \')',
            type: 'BOOLEAN',
            required: false
        }
    ],
    async run(client, interaction, [ prefixOption, addSpaceOption ], data) {
        let prefix = (prefixOption.value as string).toLowerCase();
        const addSpace = addSpaceOption?.value as boolean;

        const { guildDB } = data;

        const maxLength = 8

        if (prefix.length > maxLength) {
            return interaction.followUp(`Prefix must be shorter than ${maxLength} characters!`)
        }

        if (addSpace) prefix += ' ';

        guildDB.prefix = prefix;

        await guildDB.save();
        client.database.cache.updateGuild(guildDB);

        interaction.followUp(`The new prefix is set to \`${prefix}\` !`);

    }
}
