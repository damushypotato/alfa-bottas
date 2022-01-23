import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = async (
    client: ExtendedClient,
    guildId: string,
    seconds: number
): Promise<string | MessageOptions> => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    const secs = Math.min(
        queue.current.durationMS / 1000,
        Math.max(0, seconds)
    );

    const ms = secs * 1000;

    try {
        await queue.seek(ms);
    } catch {
        return 'Failed to seek.';
    }

    const percent = Math.floor((ms / queue.current.durationMS) * 100);

    return {
        embeds: [
            client.newEmbed({
                title: `Seeked to \`${secs}\` seconds (\`${percent}%\`)`,
            }),
        ],
    };
};

const command = new Command({
    name: 'seek',
    description: 'Seek to the given time.',
});

command.textCommand = {
    usage: '<time (seconds)>',
    async run(client, message, [seconds], { prefix }) {
        if (!seconds) return command.sendUsage(message, prefix);
        const secs = parseInt(seconds);
        if (isNaN(secs)) return command.sendUsage(message, prefix);
        message.channel.send(await common(client, message.guildId, secs));
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'time',
            description: 'The amount of seconds to seek.',
            type: 'INTEGER',
            required: true,
        },
    ],
    async run(client, interaction, options, data) {
        interaction.followUp(
            await common(
                client,
                interaction.guildId,
                options.getInteger('time')
            )
        );
    },
};

export default command;
