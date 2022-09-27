import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

const max = 10;
const default_Num = 1;

export default new Command({
    name: 'clearhistory',
    description: 'Clear snipe history.',
    ownerOnly: true,
    options: [
        {
            name: 'num',
            type: ApplicationCommandOptionType.Integer,
            description: `Number of messages delete (Default is ${default_Num}) (Maximum is ${max})`,
            required: false,
        },
    ],
    run: async (client, interaction, options, ctx, userCache) => {
        if (!userCache.OP) {
            return ctx.send('No permission');
        }

        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getInteger('num'))) || 1);

        const delMsgDBs = await client.database.fetchDeletedMessages(
            interaction.channelId,
            numOfMsgs
        );

        console.log('follow up');

        if (delMsgDBs?.length < 1) {
            const int = await ctx.send({
                embeds: [client.newEmbed({ title: 'Theres nothing to clear here.' })],
            });

            setTimeout(() => int.delete(), 5000);
            return;
        }

        const db_req = delMsgDBs.map(m => {
            return m.delete();
        });

        await Promise.all(db_req);

        const int = await ctx.sendEmbed(client.newEmbed({ title: 'Done.' }));

        setTimeout(() => int.delete(), 5000);
    },
});
