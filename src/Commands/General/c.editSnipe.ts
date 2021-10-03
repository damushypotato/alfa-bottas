import { MessageEmbed, MessageOptions, ReplyMessageOptions } from 'discord.js'
import { Command } from '../../Interfaces';
import * as DB from '../../MongoDB'

export const command: Command = {
    name: 'editsnipe',
    aliases: ['esnipe'],
    usage: 'snipe <num: max=10, default=1>',
    async run(client, message, args, data) {

        const max = 10;

        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = DB.fetchEditedMessages(message.channelId, numOfMsgs);

        const fetchingEmbed = new MessageEmbed()
        .setTitle('Fetching...')
        .setColor(client.config.color)
        
        const send_fetchEmbed = message.channel.send({ embeds: [fetchingEmbed] });
        
        const [edtMsgDB, sent] = await Promise.all([db_req, send_fetchEmbed]);
        
        if (!edtMsgDB) {
            return await sent.edit({ embeds: [new MessageEmbed().setTitle('Theres nothing to snipe here.').setColor(client.config.color)] })
        }

        let msg;
        try {
            msg = await message.channel.messages.fetch(edtMsgDB.messageID);
        }
        catch {
            msg = null;
        }
        
        const user = client.users.cache.get(edtMsgDB.authorID);

        const headerEmbed = new MessageEmbed()
            .setAuthor(edtMsgDB.authorTag, user?.displayAvatarURL())
            .setColor(client.config.color)
            .setDescription(`<@${edtMsgDB.authorID}>`)
            .setFooter(client.config.embed_footer);

        const oldMsgEmbed = new MessageEmbed()
            .setTitle(`Old Message:`)
            .setTimestamp(edtMsgDB.createdAt)
            .setDescription(edtMsgDB.oldContent)
            .setColor(client.config.color);
        const newMsgEmbed = new MessageEmbed()
            .setTitle(`Edited Message:`)
            .setTimestamp(edtMsgDB.editedAt)
            .setDescription(edtMsgDB.newContent)
            .setColor(client.config.color);

        const msgData: MessageOptions | ReplyMessageOptions = {
            content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`,
            embeds: [oldMsgEmbed, newMsgEmbed]
        }

        if (msg && !msg?.deleted) {
            await msg.reply(msgData);
            sent.delete();
        }
        else {
            msgData.embeds.unshift(headerEmbed);
            sent.edit(msgData);
        }
    }
}
