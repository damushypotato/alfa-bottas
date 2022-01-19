import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Client';
import Command from '../../Modules/Command';

const common = (
    client: ExtendedClient,
    guildId: string
): string | MessageOptions => {
    const { player } = client;
    const queue = player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    const progressbar = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    return {
        embeds: [
            client.newEmbed({
                title: 'Now Playing',
                description: `🎶 | **${queue.current.title}** (\`${timestamp.progress}%\`)\n${progressbar}`,
                footer: {
                    text: `Queued by ${queue.current.requestedBy.tag}`,
                },
            }),
        ],
    };
};

const command = new Command({
    name: 'nowplaying',
    description: 'Shows info about the current song.',
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
