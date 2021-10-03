import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import * as DB from '../../MongoDB'

export const command: Command = {
    name: 'snipe',
    usage: 'snipe <num: max=10, default=1>',
    async run(client, message, args, data) {

        const max = 10;

        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = DB.fetchDeletedMessages(message.channelId, numOfMsgs);

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
            .setAuthor(delMsgDB.authorTag, user?.displayAvatarURL())
            .setTitle(`${user?.username || delMsgDB.authorTag} said:`)
            .setTimestamp(delMsgDB.createdAt)
            .setDescription(delMsgDB.content)
            .setColor(client.config.color)
            .setFooter(client.config.embed_footer);
            
        delMsgDB.attachments.forEach(a => snipedEmbed.addField('Attachment:', a));

        snipedEmbed.addField('\u200B', `<@${delMsgDB.authorID}>`);

        sent.edit({ content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`, embeds: [snipedEmbed] });
    }
}
