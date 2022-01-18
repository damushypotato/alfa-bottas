import {
    InteractionReplyOptions,
    MessageEditOptions,
    User,
    MessageAttachment,
} from 'discord.js';
import Command from '../../Modules/Command';
import Client from '../../Client';
import { DeletedMessageDoc } from '../../Structures/Types';

const max = 10;

const getSniped = async (
    user: User,
    delMsgDB: DeletedMessageDoc,
    client: Client,
    numOfMsgs: number
) => {
    const files = await Promise.all(
        delMsgDB.attachments.map(async (Key) => {
            const data = await client.database.cos
                .getObject({
                    Bucket: 'deletedfiles',
                    Key,
                })
                .promise();
            return new MessageAttachment(data.Body as Buffer);
        })
    );

    const snipedEmbed = client.newEmbed({
        author: {
            name: delMsgDB.authorTag,
            iconURL: user?.displayAvatarURL(),
        },
        title: `${user?.username || delMsgDB.authorTag} said:`,
        timestamp: delMsgDB.createdAt,
        description: delMsgDB.content,
        fields: [
            {
                name: '\u200B',
                value: `<@${delMsgDB.authorID}>`,
            },
        ],
    });

    return {
        content: `Sniped from ${numOfMsgs} message${
            numOfMsgs > 1 ? 's' : ''
        } in the past.${files.length > 0 ? '\n\n`Attachments:`' : ''}`,
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

        const db_req = client.database.fetchDeletedMessages(
            message.channelId,
            numOfMsgs
        );

        const send_fetchEmbed = message.channel.send({
            embeds: [client.fetchingEmbed()],
        });

        const [db_res, sent] = await Promise.all([db_req, send_fetchEmbed]);

        const delMsgDB = db_res.at(-1);

        if (!delMsgDB) {
            return await sent.edit({
                embeds: [
                    client.newEmbed({ title: 'Theres nothing to snipe here.' }),
                ],
            });
        }

        const user = client.users.cache.get(delMsgDB.authorID);

        sent.edit(await getSniped(user, delMsgDB, client, numOfMsgs));
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
        const numOfMsgs = Math.floor(
            Math.min(max, Math.max(1, options.getNumber('num'))) || 1
        );

        const delMsgDB = (
            await client.database.fetchDeletedMessages(
                interaction.channelId,
                numOfMsgs
            )
        ).at(-1);

        if (!delMsgDB) {
            return await interaction.followUp({
                embeds: [
                    client.newEmbed({ title: 'Theres nothing to snipe here.' }),
                ],
            });
        }

        const user = client.users.cache.get(delMsgDB.authorID);

        interaction.followUp(
            await getSniped(user, delMsgDB, client, numOfMsgs)
        );
    },
};

export default command;
