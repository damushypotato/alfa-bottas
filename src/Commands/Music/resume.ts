import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = (client: Client, guildId: string): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    queue.setPaused(false);

    return {
        embeds: [
            client.newEmbed({
                title: 'Resumed ▶',
            }),
        ],
    };
};

const command = new Command({
    name: 'resume',
    description: 'Resume the current track.',
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
        interaction.followUp(
            common(client, interaction.guildId) as
                | string
                | InteractionReplyOptions
        );
    },
};

export default command;
