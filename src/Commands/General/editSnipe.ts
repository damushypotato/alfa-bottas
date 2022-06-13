import { InteractionReplyOptions, MessageEditOptions, User } from 'discord.js';
import Client from '../../Structures/Client';
import Command from '../../Structures/Command';
import { EditedMessageDoc } from '../../Types';

const max = 10;

const getSniped = (
    user: User,
    edtMsgDB: EditedMessageDoc,
    client: Client,
    numOfMsgs: number
) => {
    const headerEmbed = client.newEmbed({
        author: {
            name: edtMsgDB.authorTag,
            iconURL: user?.displayAvatarURL(),
        },
        description: `<@${edtMsgDB.authorID}>`,
    });

    const oldMsgEmbed = client.newEmbed({
        title: 'Old Message:',
        timestamp: edtMsgDB.createdAt,
        description: edtMsgDB.oldContent,
    });

    const newMsgEmbed = client.newEmbed({
        title: 'Edited Message:',
        timestamp: edtMsgDB.editedAt,
        description: edtMsgDB.newContent,
    });

    return {
        content: `Sniped from ${numOfMsgs} message${
            numOfMsgs > 1 ? 's' : ''
        } in the past.`,
        embeds: [headerEmbed, oldMsgEmbed, newMsgEmbed],
    } as MessageEditOptions | InteractionReplyOptions;
};

const command = new Command({
    name: 'editsnipe',
    description: 'Snipe deleted messages.',
});

command.textCommand = {
    usage: `<nummber (optional) (max is ${max})>`,
    aliases: ['esnipe'],
    async run(client, message, args, data) {
        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = client.database.fetchEditedMessages(
            message.channelId,
            numOfMsgs
        );

        const fetchingEmbed = client.fetchingEmbed();

        const send_fetchEmbed = message.channel.send({
            embeds: [fetchingEmbed],
        });

        const [db_res, sent] = await Promise.all([db_req, send_fetchEmbed]);

        const edtMsgDB = db_res.at(-1);

        if (!edtMsgDB) {
            return await sent.edit({
                embeds: [
                    client.newEmbed({ title: 'Theres nothing to snipe here.' }),
                ],
            });
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

        const msgData = getSniped(user, edtMsgDB, client, numOfMsgs);

        sent.edit(msgData as MessageEditOptions);
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

        const edtMsgDB = (
            await client.database.fetchEditedMessages(
                interaction.channelId,
                numOfMsgs
            )
        ).at(-1);

        if (!edtMsgDB) {
            return await interaction.followUp({
                embeds: [
                    client.newEmbed({ title: 'Theres nothing to snipe here.' }),
                ],
            });
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

        const msgData = getSniped(user, edtMsgDB, client, numOfMsgs);

        interaction.followUp(msgData as InteractionReplyOptions);
    },
};

export default command;
