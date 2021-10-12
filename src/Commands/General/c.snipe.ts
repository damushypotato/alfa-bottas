import { InteractionReplyOptions, MessageEditOptions, MessageEmbed, User } from 'discord.js';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';
import { DeletedMessageDoc } from '../../Structures/Types';

const max = 10;

const getSniped = (user: User, delMsgDB: DeletedMessageDoc, config: Config, numOfMsgs: number) => {
    const snipedEmbed = new MessageEmbed()
        .setAuthor(delMsgDB.authorTag, user?.displayAvatarURL())
        .setTitle(`${user?.username || delMsgDB.authorTag} said:`)
        .setTimestamp(delMsgDB.createdAt)
        .setDescription(delMsgDB.content)
        .setColor(config.color)
        .setFooter(config.embed_footer);
    
    delMsgDB.attachments.forEach(a => snipedEmbed.addField('Attachment:', a));

    snipedEmbed.addField('\u200B', `<@${delMsgDB.authorID}>`);

    return {
        content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`,
        embeds: [snipedEmbed]
    } as MessageEditOptions | InteractionReplyOptions;
}

const command = new Command({
    name: 'snipe',
    description: 'Snipe deleted messages.',
});

command.textCommand = {
    usage: `<nummber (optional) (max is ${max})>`,
    async run(client, message, args, data) {

        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = client.database.fetchDeletedMessages(message.channelId, numOfMsgs);

        const fetchingEmbed = new MessageEmbed()
        .setTitle('Fetching...')
        .setColor(client.config.color)

        const send_fetchEmbed = message.channel.send({ embeds: [fetchingEmbed] });

        const [delMsgDB, sent] = await Promise.all([db_req, send_fetchEmbed]);

        if (!delMsgDB) {
            return await sent.edit({ embeds: [new MessageEmbed().setTitle('Theres nothing to snipe here.').setColor(client.config.color)] })
        }

        const user = client.users.cache.get(delMsgDB.authorID);

        sent.edit(getSniped(user, delMsgDB, client.config, numOfMsgs));
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'num',
            type: 'NUMBER',
            description: `Number of messages in the past to snipe (Default is 1) (Maximum is ${max})`,
            required: false
        }
    ],
    async run(client, interaction, options, data) {

        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getNumber('num') )) || 1);

        const delMsgDB = await client.database.fetchDeletedMessages(interaction.channelId, numOfMsgs);

        if (!delMsgDB) {
            return await interaction.followUp({ embeds: [new MessageEmbed()
                .setTitle('Theres nothing to snipe here.')
                .setColor(client.config.color)] })
        }

        const user = client.users.cache.get(delMsgDB.authorID);

        interaction.followUp(getSniped(user, delMsgDB, client.config, numOfMsgs));
    }
}

export default command;