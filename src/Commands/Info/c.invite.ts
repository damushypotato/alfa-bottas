import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'invite',
    aliases: ['link', 'invitelink'],
    usage: 'invite',
    async run(client, message, args, data) {
        const botPerms = 8;

        const inviteURL = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=${botPerms}`

        const body = `To Invite Me To Your Other Server, [Click Here!](${inviteURL})`;

        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(body)
            .setFooter(client.config.embed_footer)
            .setColor(client.config.color);

        message.channel.send({ embeds: [embed] });
    }
}
