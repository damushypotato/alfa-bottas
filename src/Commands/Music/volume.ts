import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = (
    client: Client,
    guildId: string,
    volume?: number
): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    if (!volume)
        return {
            embeds: [
                client.newEmbed({
                    title: `The volume is at \`${queue.volume}%\``,
                }),
            ],
        };

    const vol = Math.min(100, Math.max(1, volume));

    queue.setVolume(vol);

    return {
        embeds: [
            client.newEmbed({
                title: `Set the volume to \`${vol}%\``,
            }),
        ],
    };
};

const command = new Command({
    name: 'volume',
    description: 'Set the volume.',
});

command.textCommand = {
    aliases: ['vol', 'v'],
    usage: '<volume (1 - 100)>',
    async run(client, message, [volume], data) {
        if (volume) {
            const vol = parseInt(volume);
            if (isNaN(vol)) return command.sendUsage(message, data.prefix);
            message.channel.send(common(client, message.guildId, vol));
        } else {
            message.channel.send(common(client, message.guildId));
        }
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'percentage',
            description: 'The volume to set between 1 and 100.',
            type: 'INTEGER',
        },
    ],
    async run(client, interaction, options, data) {
        interaction.followUp(
            common(
                client,
                interaction.guildId,
                options.getInteger('percentage')
            ) as string | InteractionReplyOptions
        );
    },
};

export default command;
