import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'invite',
    description: 'Sends the invite link for the bot.',
    aliases: ['link', 'invitelink'],
    usage: 'invite',
    async run(client, message, args, data) {

        const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`

        const body = `To Invite Me To A Server, [Click Here!](${inviteURL})`;

        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(body)
            .setFooter(client.config.embed_footer)
            .setColor(client.config.color);

        message.channel.send({ embeds: [embed] });
    }
}
