import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Client';
import Command from '../../Modules/Command';

const common = (
    client: ExtendedClient,
    guildId: string
): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    queue.setPaused(true);

    return {
        embeds: [
            client.newEmbed({
                title: 'Paused ⏸',
            }),
        ],
    };
};

const command = new Command({
    name: 'pause',
    description: 'Pause the current track.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        message.channel.send(common(client, message.guildId));
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp(common(client, interaction.guildId));
    },
};

export default command;
