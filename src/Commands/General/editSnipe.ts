import {
    InteractionReplyOptions,
    MessageEditOptions,
    MessageEmbed,
    User,
    Message,
} from 'discord.js';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';
import { EditedMessageDoc } from '../../Structures/Types';

const max = 10;

const getSniped = (
    user: User,
    edtMsgDB: EditedMessageDoc,
    config: Config,
    numOfMsgs: number
) => {
    const oldMsgEmbed = new MessageEmbed()
        .setTitle(`Old Message:`)
        .setTimestamp(edtMsgDB.createdAt)
        .setDescription(edtMsgDB.oldContent)
        .setColor(config.color);

    const newMsgEmbed = new MessageEmbed()
        .setTitle(`Edited Message:`)
        .setTimestamp(edtMsgDB.editedAt)
        .setDescription(edtMsgDB.newContent)
        .setColor(config.color);

    return {
        content: `Sniped from ${numOfMsgs} message${
            numOfMsgs > 1 ? 's' : ''
        } in the past.`,
        embeds: [oldMsgEmbed, newMsgEmbed],
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

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching...')
            .setColor(client.config.color);

        const send_fetchEmbed = message.channel.send({
            embeds: [fetchingEmbed],
        });

        const [db_res, sent] = await Promise.all([db_req, send_fetchEmbed]);

        const edtMsgDB = db_res.at(-1);

        if (!edtMsgDB) {
            return await sent.edit({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Theres nothing to snipe here.')
                        .setColor(client.config.color),
                ],
            });
        }

        let msg: Message;
        try {
            msg = await message.channel.messages.fetch(edtMsgDB.messageID);
        } catch {
            msg = null;
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

        const headerEmbed = new MessageEmbed()
            .setAuthor(edtMsgDB.authorTag, user?.displayAvatarURL())
            .setColor(client.config.color)
            .setDescription(
                `<@${edtMsgDB.authorID}>${
                    !msg || msg?.deleted ? ' (Message has been deleted)' : ''
                }`
            )
            .setFooter(client.config.embed_footer);

        const msgData = getSniped(user, edtMsgDB, client.config, numOfMsgs);

        if (msg && !msg?.deleted) {
            await msg.reply(msgData);
            sent.delete();
        } else {
            msgData.embeds.unshift(headerEmbed);
            sent.edit(msgData);
        }
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
                    new MessageEmbed()
                        .setTitle('Theres nothing to snipe here.')
                        .setColor(client.config.color),
                ],
            });
        }

        let msg: Message;
        try {
            msg = await interaction.channel.messages.fetch(edtMsgDB.messageID);
        } catch {
            msg = null;
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

        const headerEmbed = new MessageEmbed()
            .setAuthor(edtMsgDB.authorTag, user?.displayAvatarURL())
            .setColor(client.config.color)
            .setDescription(
                `<@${edtMsgDB.authorID}>${
                    !msg || msg?.deleted
                        ? ' (Message has been deleted)'
                        : ` [Message Link](${msg?.url})`
                }`
            )
            .setFooter(client.config.embed_footer);

        const msgData = getSniped(user, edtMsgDB, client.config, numOfMsgs);

        msgData.embeds.unshift(headerEmbed);

        interaction.followUp(msgData);
    },
};

export default command;
