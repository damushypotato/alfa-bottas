import { MessageEmbed, Message } from 'discord.js';
import { SlashCommand } from '../../Structures/Interfaces';

export const slashCommand: SlashCommand = {
    name: 'editsnipe',
    description: 'Snipes edited messages.',
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

        const edtMsgDB = await client.database.fetchEditedMessages(interaction.channelId, numOfMsgs);

        if (!edtMsgDB) {
            return await interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Theres nothing to snipe here.')
                .setColor(client.config.color)] })
        }

        let msg: Message;
        try {
            msg = await interaction.channel.messages.fetch(edtMsgDB.messageID);
        }
        catch {
            msg = null;
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

        const headerEmbed = new MessageEmbed()
            .setAuthor(edtMsgDB.authorTag, user?.displayAvatarURL())
            .setColor(client.config.color)
            .setDescription(`<@${edtMsgDB.authorID}>${!msg || msg?.deleted ? ' (Message has been deleted)' : ` [Message Link](${msg?.url})`}`)
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

        interaction.followUp({
            content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`,
            embeds: [headerEmbed, oldMsgEmbed, newMsgEmbed]
        });
    }
}
