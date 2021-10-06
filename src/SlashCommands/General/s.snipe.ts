import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../Interfaces';

export const slashCommand: SlashCommand = {
    name: 'snipe',
    description: 'Snipes deleted messages.',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'num',
            type: 'NUMBER',
            description: 'Number of messages in the past to snipe (Default is 1) (Maximum is 10)',
            required: false
        }
    ],
    async run(client, interaction, options, data) {
        const max = 10;

        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getNumber('num') )) || 1);

        const delMsgDB = await client.database.fetchDeletedMessages(interaction.channelId, numOfMsgs);

        if (!delMsgDB) {
            return await interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Theres nothing to snipe here.')
                .setColor(client.config.color)] })
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

        interaction.followUp({
            content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`,
            embeds: [snipedEmbed]
        });
    }
}
