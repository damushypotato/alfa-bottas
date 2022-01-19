import { User } from 'discord.js';
import ExtendedClient from '../../Structures/Client';
import Command from '../../Structures/Command';

const getEmbed = (target: User, client: ExtendedClient) => {
    const embed = client.newEmbed({
        title: 'heres ur pfp',
        description: `<@${target.id}>`,
        image: {
            url: `${target.displayAvatarURL({ dynamic: true })}?size=1024`,
        },
    });

    return embed;
};

const command = new Command({
    name: 'pfp',
    description: "Shows a user's profile picture.",
});

command.textCommand = {
    usage: '<@User>',
    async run(client, message, [mention], data) {
        let target: User;
        if (mention) {
            target = client.tools.mentions.getUserFromMention(mention, client);
            if (!target) return command.sendUsage(message, data.prefix);
        } else {
            target = message.author;
        }

        message.channel.send({ embeds: [getEmbed(target, client)] });
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The user whose pfp you want to get.',
            required: false,
        },
    ],
    async run(client, interaction, options, data) {
        const target = options.getUser('target') || interaction.user;

        interaction.followUp({ embeds: [getEmbed(target, client)] });
    },
};

export default command;
