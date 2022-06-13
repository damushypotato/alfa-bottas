import { InteractionReplyOptions, MessageOptions } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';

const common = async (
    client: Client,
    guildId: string
): Promise<string | MessageOptions> => {
    const queue = client.player.getQueue(guildId);
    if (!queue?.playing) return 'There is nothing playing.';

    try {
        await queue.back();
    } catch {
        return 'Unable to rewind.';
    }

    return {
        embeds: [
            client.newEmbed({
                title: '⏮ Playing the previous track',
            }),
        ],
    };
};

const command = new Command({
    name: 'back',
    description: 'Play the previous track.',
});

command.textCommand = {
    usage: '',
    aliases: ['rewind', 'previous'],
    async run(client, message, args, data) {
        message.channel.send(await common(client, message.guildId));
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp(
            (await common(client, interaction.guildId)) as
                | string
                | InteractionReplyOptions
        );
    },
};

export default command;
