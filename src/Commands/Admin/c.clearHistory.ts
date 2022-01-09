import { Message, MessageEmbed } from 'discord.js';
import Command from '../../Modules/Command';
import { DeletedMessageDoc } from '../../Structures/Types';

const max = 10;

const deleteFromDB = async (delMsgDBs: DeletedMessageDoc[]) => {
    const db_req = delMsgDBs.map((m) => {
        return m.delete();
    });

    return await Promise.all(db_req);
};

const command = new Command({
    name: 'clearhistory',
    description: 'Clear snipe history.',
    ownerOnly: true,
});

command.textCommand = {
    usage: '<num>',
    async run(client, message, args, data) {
        if (!data.userCache.OP) {
            return message.channel.send('No permission');
        }

        const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

        const db_req = client.database.fetchDeletedMessages(
            message.channelId,
            numOfMsgs
        );

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching...')
            .setColor(client.config.color);

        const send_fetchEmbed = message.channel.send({
            embeds: [fetchingEmbed],
        });

        const [delMsgDBs, sent] = await Promise.all([db_req, send_fetchEmbed]);

        if (delMsgDBs?.length < 1) {
            const msg = await sent.edit({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Theres nothing to clear here.')
                        .setColor(client.config.color),
                ],
            });

            setTimeout(() => msg.delete(), 5000);
            return;
        }
        await deleteFromDB(delMsgDBs);

        const msg = await sent.edit({
            embeds: [
                new MessageEmbed()
                    .setTitle('Done.')
                    .setColor(client.config.color),
            ],
        });

        setTimeout(() => msg.delete(), 5000);
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'num',
            type: 'INTEGER',
            description: `Number of messages delete (Default is 1) (Maximum is ${max})`,
            required: false,
        },
    ],
    async run(client, interaction, options, data) {
        if (!data.userCache.OP) {
            return interaction.followUp('No permission');
        }

        const numOfMsgs = Math.floor(
            Math.min(max, Math.max(1, options.getInteger('num'))) || 1
        );

        const delMsgDBs = await client.database.fetchDeletedMessages(
            interaction.channelId,
            numOfMsgs
        );

        if (delMsgDBs?.length < 1) {
            const int = (await interaction.followUp({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Theres nothing to clear here.')
                        .setColor(client.config.color),
                ],
            })) as Message;

            setTimeout(() => int.delete(), 5000);
            return;
        }

        await deleteFromDB(delMsgDBs);

        const int = (await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setTitle('Done.')
                    .setColor(client.config.color),
            ],
        })) as Message;

        setTimeout(() => int.delete(), 5000);
    },
};

export default command;
