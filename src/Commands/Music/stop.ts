import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = (
    client: ExtendedClient,
    guildId: string
): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    queue.destroy();

    return {
        embeds: [
            client.newEmbed({
                title: 'Stopped ⏹',
            }),
        ],
    };
};

const command = new Command({
    name: 'stop',
    description: 'Stop playing and leave.',
});

command.textCommand = {
    usage: '',
    aliases: ['end', 'leave', 'l'],
    async run(client, message, args, data) {
        message.channel.send(common(client, message.guildId));
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp(common(client, interaction.guildId) as string | InteractionReplyOptions);
    },
};

export default command;
