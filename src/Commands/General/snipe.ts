import { InteractionReplyOptions, MessageEditOptions, MessageAttachment } from 'discord.js';
import Command from '../../Structures/Command';
import Client from '../../Structures/Client';
import { DeletedMessageDoc } from '../../Types';

const max = 10;

const getSniped = async (delMsgDB: DeletedMessageDoc, client: Client, numOfMsgs: number) => {
    const user = client.users.cache.get(delMsgDB.authorID);

    let files: MessageAttachment[];
    try {
        files = await Promise.all(
            delMsgDB.attachments.map(async Key => {
                const data = await client.database.cos
                    .getObject({
                        Bucket: 'deletedfiles',
                        Key,
                    })
                    .promise();

                return new MessageAttachment(data.Body as Buffer, Key);
            })
        );
    } catch {
        files = [];
    }

    const hadAttachments = delMsgDB.attachments.length > 0;
    const hasAliveAttachments = files.length > 0;
    const hadContent = delMsgDB.content != null;

    const snipedEmbed = client.newEmbed({
        author: {
            name: `Sniped (${numOfMsgs})`,
        },
        timestamp: delMsgDB.createdAt,
        footer: {
            text: user?.tag || 'Unknown User',
            iconURL: user?.displayAvatarURL(),
        },
    });

    if (hadContent) snipedEmbed.description = delMsgDB.content;
    else snipedEmbed.title = 'Message had no text.';

    return {
        content: hasAliveAttachments ? '\n\n`Attachments:`' : null,
        embeds: [snipedEmbed],
        files,
    } as MessageEditOptions | InteractionReplyOptions;
};

const command = new Command({
    name: 'snipe',
    description: 'Snipe deleted messages.',
});

command.textCommand = {
    usage: `<nummber (optional) (max is ${max})>`,
    async run(client, message, args, data) {
        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = client.database.fetchDeletedMessages(message.channelId, numOfMsgs);

        const send_fetchEmbed = message.channel.send({
            embeds: [client.fetchingEmbed()],
        });

        const [db_res, sent] = await Promise.all([db_req, send_fetchEmbed]);

        const delMsgDB = db_res.at(-1);

        if (!delMsgDB) {
            return await sent.edit({
                embeds: [client.newEmbed({ title: 'Theres nothing to snipe here.' })],
            });
        }

        sent.edit((await getSniped(delMsgDB, client, numOfMsgs)) as MessageEditOptions);
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'num',
            type: 'NUMBER',
            description: `Number of messages in the past to snipe (Default is 1) (Maximum is ${max})`,
            required: false,
        },
    ],
    async run(client, interaction, options, data) {
        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getNumber('num'))) || 1);

        const delMsgDB = (
            await client.database.fetchDeletedMessages(interaction.channelId, numOfMsgs)
        ).at(-1);

        if (!delMsgDB) {
            return await interaction.followUp({
                embeds: [client.newEmbed({ title: 'Theres nothing to snipe here.' })],
            });
        }

        interaction.followUp(
            (await getSniped(delMsgDB, client, numOfMsgs)) as InteractionReplyOptions
        );
    },
};

export default command;
