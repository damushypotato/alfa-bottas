import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = (
    client: ExtendedClient,
    guildId: string
): string | MessageOptions => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    queue.skip();

    return {
        embeds: [
            client.newEmbed({
                title: 'Skipped ⏭',
            }),
        ],
    };
};

const command = new Command({
    name: 'skip',
    description: 'Play the next song in the queue.',
});

command.textCommand = {
    usage: '',
    aliases: ['next'],
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
