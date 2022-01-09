import {} from 'discord.js';
import Command from '../../Modules/Command';

const maxLength = 8;

const command = new Command({
    name: 'setprefix',
    description: 'Set a new prefix for the server.',
    memberPerms: ['ADMINISTRATOR'],
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'prefix',
            description: 'The new prefix (max 8 characters)',
            type: 'STRING',
            required: true,
        },
        {
            name: 'addspace',
            description:
                "Add a space after the prefix? (example prefix='bot ')",
            type: 'BOOLEAN',
            required: false,
        },
    ],
    async run(client, interaction, options, data) {
        const prefixInput = options.getString('prefix');
        const addSpace = options.getBoolean('addspace');

        let prefix = prefixInput.toLowerCase();

        if (prefix.length > maxLength) {
            return interaction.followUp(
                `Prefix must be shorter than ${maxLength} characters!`
            );
        }

        if (addSpace) prefix += ' ';

        if (prefix == data.guildCache.prefix)
            return interaction.followUp(`Prefix already set!`);

        const guildDB = await client.database.fetchGuildDB(interaction.guild);
        guildDB.prefix = prefix;
        await guildDB.save();
        client.database.cache.fetchAndUpdateGuild(guildDB);

        interaction.followUp(`The new prefix is set to \`${prefix}\` !`);
    },
};

export default command;
