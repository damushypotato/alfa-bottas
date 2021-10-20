import Command from '../../Modules/Command';

const command = new Command({
    name: 'testemoji',
    description: "The bot's custom emojis.",
});

command.textCommand = {
    usage: '<name>',
    async run(client, message, [emoji], data) {
        if (emoji == '$reload') {
            client.customEmojis.setEmojis();
            return message.channel.send('Emojis Reloaded.');
        }
        message.channel.send(client.customEmojis.get(emoji));
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: 'The name of the emoji to send',
        },
    ],
    async run(client, interaction, options, data) {
        const emoji = options.getString('name');

        if (emoji == '$reload') {
            client.customEmojis.setEmojis();
            return interaction.followUp('Emojis Reloaded.');
        }

        interaction.followUp(client.customEmojis.get(emoji));
    },
};

export default command;
