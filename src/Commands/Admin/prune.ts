import { ApplicationCommandOptionType, TextChannel } from 'discord.js';
import Command from '../../Structures/Command';

const max = 50;

export default new Command({
    name: 'prune',
    description: 'Bulk delete messages. (Note: only works in the last 14 days)',
    ownerOnly: false,
    memberPerms: ['Administrator'],
    options: [
        {
            name: 'num',
            type: ApplicationCommandOptionType.Integer,
            description: `Number of messages to delete (Default is 1) (Maximum is ${max})`,
            required: false,
        },
        {
            name: 'deletepinned',
            type: ApplicationCommandOptionType.Boolean,
            description: 'Delete pinned messages? Default is true.',
            required: false,
        },
    ],
    run: async (client, interaction, options, ctx) => {
        const num = Math.floor(Math.min(max, Math.max(1, options.getInteger('num'))) || 1);

        const pinnedOption = options.getBoolean('deletepinned');
        const delPinned = pinnedOption == null ? true : pinnedOption;

        const fetched = await interaction.channel.messages.fetch({
            limit: num + 1,
        });

        const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
        const toDelete = delPinned ? fetched : notPinned;
        const del = await interaction.channel.bulkDelete(toDelete, true);
        const msg = await ctx.sendEmbed(
            client.newEmbed({
                title: `Deleted ${Math.max(del.size - 1, 0)} messages.`,
            })
        );
        setTimeout(() => msg.delete(), 5000);
    },
});
