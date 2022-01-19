import { MessageOptions } from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = (
    client: ExtendedClient,
    guildId: string
): string | MessageOptions => {
    const { player } = client;
    const queue = player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    const progressbar = queue.createProgressBar();
    const timestamp = queue.getPlayerTimestamp();

    const overflow = queue.tracks.length - max;

    const limited = queue.tracks.slice(0, max);

    const embed = client.newEmbed({
        title: 'Queue',
        description: `Now playing 🎶 | **${queue.current.title}** (\`${timestamp.progress}%\`)\n${progressbar}`,
        fields: [
            ...limited.map((t, i) => {
                return {
                    name: `+${i + 1} | \`${t.title}\``,
                    value: `*Requested by <@${t.requestedBy.id}>*`,
                };
            }),
        ],
    });

    if (overflow > 0) {
        embed.footer = {
            text: `And ${overflow} more tracks`,
        };
    }

    return {
        embeds: [embed],
    };
};

const command = new Command({
    name: 'queue',
    description: 'Shows all the songs in the queue.',
});

const max = 10;

command.textCommand = {
    usage: '',
    async run(client, message, options, data) {
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
