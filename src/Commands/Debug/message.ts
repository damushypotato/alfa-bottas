import { ApplicationCommandOptionType, ChannelType, TextChannel } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'message',
    description: 'Send a message.',
    ownerOnly: true,
    options: [
        {
            name: 'text',
            description: 'The text to send.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Channel,
            name: 'channel',
            channelTypes: [ChannelType.GuildText],
            required: false,
            description: 'The channel to send the message in. Defaults to current channel.',
        },
    ],
    ephemeralDefer: async () => true,
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const text = options.getString('text');

        const channelOpt = options.getChannel('channel') as TextChannel;
        const channel: TextChannel = channelOpt == null ? (int.channel as TextChannel) : channelOpt;

        try {
            channel.send(text);
        } catch (error) {
            return ctx.send('Failed to send.');
        }
        ctx.send('✓');
    },
});
