import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../Structures/Command';

const max = 10;

export default new Command({
    name: 'editsnipe',
    description: 'Snipe an edit.',
    ownerOnly: false,
    options: [
        {
            name: 'num',
            type: ApplicationCommandOptionType.Integer,
            description: `Number of messages in the past to snipe (Default is 1) (Maximum is ${max})`,
            required: false,
        },
        {
            name: 'secret',
            type: ApplicationCommandOptionType.Boolean,
            description: 'Hide in chat.',
            required: false,
        },
    ],
    memberPerms: [],
    ephemeralDefer: async (client, int, options, ctx, userCache, guildCache) => {
        if (userCache.OP) {
            return options.getBoolean('secret');
        }
        return false;
    },
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getNumber('num'))) || 1);

        const edtMsgDB = (await client.database.fetchEditedMessages(int.channelId, numOfMsgs)).at(
            -1
        );

        if (!edtMsgDB) {
            return await ctx.send({
                embeds: [client.newEmbed({ title: 'Theres nothing to snipe here.' })],
            });
        }

        const user = client.users.cache.get(edtMsgDB.authorID);

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

        ctx.send({
            content: `Sniped from ${numOfMsgs} message${numOfMsgs > 1 ? 's' : ''} in the past.`,
            embeds: [headerEmbed, oldMsgEmbed, newMsgEmbed],
        });
    },
});
