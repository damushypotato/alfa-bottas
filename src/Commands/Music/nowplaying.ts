import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';
import { modeLookup } from '../../Types';

const common = (client: Client, guildId: string): string | MessageOptions => {
    const { player } = client;
    const queue = player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    const progressbar = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    return {
        embeds: [
            client.newEmbed({
                title: `Now Playing | \`( 🔊 ${
                    queue.volume
                }% Volume )\` \`( Loop ${modeLookup[queue.repeatMode]} )\``,
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
    aliases: ['np'],
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
