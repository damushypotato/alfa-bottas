import { ApplicationCommandOptionType, AttachmentBuilder } from 'discord.js';
import Command from '../../Structures/Command';

const max = 10;

export default new Command({
    name: 'snipe',
    description: 'Snipe a deleted message.',
    ownerOnly: false,
    memberPerms: [],
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
    ephemeralDefer: async (client, int, options, ctx, userCache, guildCache) => {
        if (userCache.OP) {
            return int.options.getBoolean('secret');
        }
        return false;
    },
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const numOfMsgs = Math.floor(Math.min(max, Math.max(1, options.getNumber('num'))) || 1);

        const delMsgDB = (await client.database.fetchDeletedMessages(int.channelId, numOfMsgs)).at(
            -1
        );

        if (!delMsgDB) {
            return await ctx.send({
                embeds: [client.newEmbed({ title: 'Theres nothing to snipe here.' })],
            });
        }

        const user = client.users.cache.get(delMsgDB.authorID);

        let files: AttachmentBuilder[];
        try {
            files = await Promise.all(
                delMsgDB.attachments.map(async Key => {
                    const data = await client.database.cos
                        .getObject({
                            Bucket: 'deletedfiles',
                            Key,
                        })
                        .promise();

                    return new AttachmentBuilder(data.Body as Buffer, { name: Key });
                })
            );
        } catch {
            files = [];
        }

        const hadAttachments = delMsgDB.attachments.length > 0;
        const hasAliveAttachments = files.length > 0;
        const hadContent = delMsgDB.content != null;

        const snipedEmbed = client.newEmbed({
            description: hadContent ? delMsgDB.content : '',
            title: !hadContent ? 'Message had no text.' : '',
            author: {
                name: `Sniped (${numOfMsgs})`,
            },
            timestamp: delMsgDB.createdAt,
            footer: {
                text: user?.tag || 'Unknown User',
                iconURL: user?.displayAvatarURL(),
            },
        });

        ctx.send({
            content: hasAliveAttachments
                ? '\n\n`Attachments:`'
                : hadAttachments
                ? `\`${delMsgDB.attachments.length} expired attachment${
                      delMsgDB.attachments.length > 1 ? 's' : ''
                  }\``
                : null,
            embeds: [snipedEmbed],
            files,
        });
    },
});
