import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'pfp',
    aliases: ['avatar'],
    usage: 'invite',
    async run(client, message, args, data) {

        const user = !args[0] ? message.author : message.mentions.users.first();

        if (!user) return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        const embed = new MessageEmbed()
            .setTitle(`heres ur pfp`)
            .setDescription(`<@${user.id}>`)
            .setImage(`${user.displayAvatarURL()}?size=1024`)
            .setFooter(client.config.embed_footer)
            .setColor(client.config.color)

        message.channel.send({ embeds: [embed] });
    }
}
