import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import * as DB from '../../MongoDB'

export const command: Command = {
    name: 'snipe',
    async run(client, message, args, data) {
        const db_req = DB.fetchDeletedMessage(message.channelId);

        const fetchingEmbed = new MessageEmbed()
        .setTitle('Fetching...')
        .setColor(client.config.color)

        const send_fetchEmbed = message.channel.send({ embeds: [fetchingEmbed] });

        const [delMsgDB, sent] = await Promise.all([db_req, send_fetchEmbed]);

        if (!delMsgDB) {
            return await sent.edit({ embeds: [new MessageEmbed().setTitle('Theres nothing to snipe here.').setColor(client.config.color)] })
        }

        const user = client.users.cache.get(delMsgDB.authorID);
        
        const snipedEmbed = new MessageEmbed()
            .setAuthor(delMsgDB.authorTag, user.displayAvatarURL())
            .setTitle(`${user.username} said:`)
            .setTimestamp(delMsgDB.createdAt)
            .setDescription(delMsgDB.content)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer);
            
        delMsgDB.attachments.forEach(a => snipedEmbed.addField('Attachment:', a));

        snipedEmbed.addField('\u200B', user.toString())

        sent.edit({ embeds: [snipedEmbed] });
    }
}
