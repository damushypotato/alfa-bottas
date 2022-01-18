import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Client';
import Command from '../../Modules/Command';

const common = (
    client: ExtendedClient,
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
    usage: '<volume (1 - 100)>',
    async run(client, message, [volume], data) {
        if (!volume) return command.sendUsage(message, data.prefix);
        let vol = parseInt(volume);
        if (isNaN(vol)) vol = 100;
        message.channel.send(common(client, message.guildId, vol));
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
            )
        );
    },
};

export default command;