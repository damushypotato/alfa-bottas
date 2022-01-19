import { TextChannel } from 'discord.js';
import Command from '../../Structures/Command';

const command = new Command({
    name: 'message',
    description: 'Send a message in a channel.',
    ownerOnly: true,
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    ephemeralDefer: async () => true,
    options: [
        {
            name: 'text',
            description: 'The text to send.',
            type: 'STRING',
            required: true,
        },
        {
            type: 'CHANNEL',
            name: 'channel',
            channelTypes: ['GUILD_TEXT'],
            required: false,
            description:
                'The channel to send the message in. Defaults to current channel.',
        },
    ],
    async run(client, interaction, options, data) {
        const text = options.getString('text');

        const channelOpt = options.getChannel('channel') as TextChannel;
        const channel: TextChannel =
            channelOpt == null
                ? (interaction.channel as TextChannel)
                : channelOpt;

        try {
            channel.send(text);
        } catch (error) {
            return interaction.followUp('Failed to send.');
        }
        interaction.followUp('✓');
    },
};

export default command;
