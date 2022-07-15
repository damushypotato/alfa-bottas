import Command from '../../Structures/Command';
import { DeletedMessageDoc } from '../../Types';

const max = 10;
const default_Num = 1;

const deleteFromDB = async (delMsgDBs: DeletedMessageDoc[]) => {
    const db_req = delMsgDBs.map(m => {
        return m.delete();
    });

    return await Promise.all(db_req);
};

const command = new Command({
    name: 'clearhistory',
    description: 'Clear snipe history.',
    ownerOnly: true,
    textCommand: {
        usage: '<num>',
    },
    slashCommand: {
        type: 'CHAT_INPUT',
        options: [
            {
                name: 'num',
                type: 'INTEGER',
                description: `Number of messages delete (Default is ${default_Num}) (Maximum is ${max})`,
                required: false,
            },
        ],
    },
});

command.run = async ctx => {
    const { message } = ctx;
    const { num } = ctx.slashCommand.options;

    const num_ = num || default_Num;

    if (num_ > max) {
        return message.reply(`Maximum number of messages to delete is ${max}`);
    }

    const delMsgDBs = await ctx.client.db.DeletedMessage.find({
        guild_id: message.guild.id,
        channel_id: message.channel.id,
    })
        .sort({ createdAt: -1 })
        .limit(num_);

    if (delMsgDBs.length === 0) {
        return message.reply('No messages to delete.');
    }

    const delMsgs = delMsgDBs.map(m => {
        return m.message;
    });

    await deleteFromDB(delMsgDBs);

    return message.channel.bulkDelete(delMsgs);
};

// command.textCommand = {
//     usage: '<num>',
//     async run(ctx) {
//         if (!data.userCache.OP) {
//             return message.channel.send('No permission');
//         }

//         const numOfMsgs = Math.min(max, Math.max(1, parseInt(args[0]))) || 1;

//         const db_req = client.database.fetchDeletedMessages(
//             message.channelId,
//             numOfMsgs
//         );

//         const send_fetchEmbed = message.channel.send({
//             embeds: [client.fetchingEmbed()],
//         });

//         const [delMsgDBs, sent] = await Promise.all([db_req, send_fetchEmbed]);

//         if (delMsgDBs?.length < 1) {
//             const msg = await sent.edit({
//                 embeds: [
//                     client.newEmbed({
//                         title: 'Theres nothing to clear here.',
//                     }),
//                 ],
//             });

//             setTimeout(() => msg.delete(), 5000);
//             return;
//         }
//         await deleteFromDB(delMsgDBs);

//         const msg = await sent.edit({
//             embeds: [client.newEmbed({ title: 'Done.' })],
//         });

//         setTimeout(() => msg.delete(), 5000);
//     },
// };

// command.slashCommand = {
//     type: 'CHAT_INPUT',
//     options: [
//         {
//             name: 'num',
//             type: 'INTEGER',
//             description: `Number of messages delete (Default is 1) (Maximum is ${max})`,
//             required: false,
//         },
//     ],
//     async run(client, interaction, options, data) {
//         if (!data.userCache.OP) {
//             return interaction.followUp('No permission');
//         }

//         const numOfMsgs = Math.floor(
//             Math.min(max, Math.max(1, options.getInteger('num'))) || 1
//         );

//         const delMsgDBs = await client.database.fetchDeletedMessages(
//             interaction.channelId,
//             numOfMsgs
//         );

//         if (delMsgDBs?.length < 1) {
//             const int = (await interaction.followUp({
//                 embeds: [
//                     client.newEmbed({ title: 'Theres nothing to clear here.' }),
//                 ],
//             })) as Message;

//             setTimeout(() => int.delete(), 5000);
//             return;
//         }

//         await deleteFromDB(delMsgDBs);

//         const int = (await interaction.followUp({
//             embeds: [client.newEmbed({ title: 'Done.' })],
//         })) as Message;

//         setTimeout(() => int.delete(), 5000);
//     },
// };

export default command;
