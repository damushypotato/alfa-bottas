import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';
import { QueueRepeatMode } from 'discord-player';
import { modeLookup } from '../../Types';

const common = (
    client: Client,
    guildId: string,
    mode?: QueueRepeatMode
): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    if (mode == null) {
        return {
            embeds: [
                client.newEmbed({
                    title: `The current loop mode is \`${
                        modeLookup[queue.repeatMode]
                    }\``,
                }),
            ],
        };
    }

    queue.setRepeatMode(mode);

    return {
        embeds: [
            client.newEmbed({
                title: `Set the loop mode to \`${modeLookup[mode]}\``,
            }),
        ],
    };
};

const command = new Command({
    name: 'loop',
    description: 'Set the loop mode.',
});

command.textCommand = {
    usage: `<off | track | queue | autoplay>`,
    async run(client, message, [mode], { prefix }) {
        if (mode) {
            const qMode = QueueRepeatMode[mode.toUpperCase()];
            if (qMode == null || typeof qMode != 'number')
                return command.sendUsage(message, prefix);

            message.channel.send(common(client, message.guildId, qMode));
        } else {
            message.channel.send(common(client, message.guildId));
        }
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'mode',
            description: 'The type of loop to set.',
            type: 'INTEGER',
            choices: [
                {
                    name: 'Off',
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: 'Track (Single song)',
                    value: QueueRepeatMode.TRACK,
                },
                {
                    name: 'Queue',
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: 'Autoplay',
                    value: QueueRepeatMode.AUTOPLAY,
                },
            ],
        },
    ],
    async run(client, interaction, options, data) {
        interaction.followUp(
            common(client, interaction.guildId, options.getInteger('mode')) as
                | string
                | InteractionReplyOptions
        );
    },
};

export default command;
