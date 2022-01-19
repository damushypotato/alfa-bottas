import {} from 'discord.js';
import Client from '../../Client';
import Command from '../../Modules/Command';

const getEmbed = (client: Client) => {
    const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

    const embed = client.newEmbed({
        author: {
            name: client.user.username,
            iconURL: client.user.displayAvatarURL(),
        },
        description: `To Invite Me To A Server, [Click Here!](${inviteURL})`,
    });

    return embed;
};

const command = new Command({
    name: 'invite',
    description: 'The link to invite this bot to other servers.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        message.channel.send({ embeds: [getEmbed(client)] });
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        interaction.followUp({ embeds: [getEmbed(client)] });
    },
};

export default command;
