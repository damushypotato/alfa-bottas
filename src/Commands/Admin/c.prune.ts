import { MessageEmbed, Message, TextChannel } from 'discord.js';
import Command from '../../Modules/Command';

const max = 50;

const command = new Command({
    name: 'prune',
    description:
        'Bulk delete messages. Note: you can only bulk delete messages under 14 days old.',
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'num',
            type: 'INTEGER',
            description: `Number of messages to delete (Default is 1) (Maximum is ${max})`,
            required: false,
        },
        {
            name: 'deletepinned',
            type: 'BOOLEAN',
            description: 'Delete pinned messages? Default is true.',
            required: false,
        },
    ],
    async run(client, interaction, options, data) {
        const num = Math.floor(
            Math.min(max, Math.max(1, options.getInteger('num'))) || 1
        );

        const pinnedOption = options.getBoolean('deletepinned');

        const delPinned = pinnedOption == null ? true : pinnedOption;

        const fetched = await interaction.channel.messages.fetch({
            limit: num + 1,
        });
        const notPinned = fetched.filter((fetchedMsg) => !fetchedMsg.pinned);

        const toDelete = delPinned ? fetched : notPinned;

        const del = await (interaction.channel as TextChannel).bulkDelete(
            toDelete,
            true
        );

        const msg = (await interaction.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Deleted ${Math.max(del.size - 1, 0)} messages.`)
                    .setColor(client.config.color),
            ],
        })) as Message;

        setTimeout(() => msg.delete(), 5000);
    },
};

export default command;
