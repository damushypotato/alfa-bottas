import { MessageEmbed, EmbedFieldData, SelectMenuInteraction, ButtonInteraction, MessageButton, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Message, CollectorFilter } from 'discord.js';
import Command from '../../Modules/Command';
import { CommandCategory, Config } from '../../Structures/Interfaces';
import { Chunk } from '../../Modules/Tools'

const menu = (categories: CommandCategory[], disabled: boolean, placeholder?: string) => new MessageActionRow().addComponents(
    new MessageSelectMenu()
        .setCustomId('help-menu')
        .setPlaceholder(placeholder || 'Select one...')
        .setDisabled(disabled)
        .addOptions(categories.map(c => {
            return {
                label: c.name,
                value: c.name.toLowerCase(),
                description: `Commands from the ${c.name} category`
            } as MessageSelectOptionData;
        } ))
);
const buttons = (disabled: boolean) => new MessageActionRow().addComponents(
    new MessageButton()
        .setEmoji('◀')
        .setCustomId('back-btn')
        .setDisabled(disabled)
        .setStyle('PRIMARY'),

    new MessageButton()
        .setEmoji('▶')
        .setCustomId('next-btn')
        .setDisabled(disabled)
        .setStyle('PRIMARY')
);

const getEmbeds = (category: CommandCategory, config: Config) => {
    const commands = [...category.commands];

    return Chunk.default<Command>(commands, 5).map((cmds, i, a) => {
        return new MessageEmbed()
        .setTitle(`${category.name} Commands`)
        .setColor(config.color)
        .setFooter(`${config.embed_footer} | Page ${i + 1} of ${a.length}`)
        .addFields(cmds.map(c => {
            return {
                name: `\`${c.name}\` (*${[
                    c.textCommand ? 'prefixed' : null,
                    c.slashCommand ?  'slash' : null
                ].filter(Boolean).join(', ')}*)`,
                value: c.description,
                inline: false
            } as EmbedFieldData
        }));
    });
}

const newIndex = (currentIndex: number, btnId: string, embedsLength: number) => {
    if (btnId == 'back-btn') {
        currentIndex--;
    }
    else if (btnId == 'next-btn') {
        currentIndex++;
    }

    return Math.abs(embedsLength + currentIndex) % embedsLength;
}

const filter = (interaction: ButtonInteraction | SelectMenuInteraction, userId: string) => {
    if (interaction.user.id == userId) return true;
    else {
        interaction.reply({ content: 'This is not for you!', ephemeral: true })
        return false;
    }
};

const command = new Command({
    name: 'help',
    description: 'Shows all the commands.',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        const allCategories = [...new Set(client.commands.map(c => c.category))];

        const categories = allCategories.map(cat => {
            return {
                name: cat,
                commands: client.commands
                    .filter(cmd => cmd.category == cat)
                    .map(c => c)
            } as CommandCategory;
        });

        const embed = new MessageEmbed().setTitle('Choose a category:')
            .setColor(client.config.color)

        const sent = await message.channel.send({ embeds: [embed], components: [menu(categories, false), buttons(true)] })

        let currentPageIndex = 0;
        let embeds: MessageEmbed[];

        sent.createMessageComponentCollector({ 
            filter: (int: SelectMenuInteraction) => filter(int, message.author.id),
            componentType: 'SELECT_MENU',
            time: 30000
        })
            .on('collect', int => {
                currentPageIndex = 0;
                const [ catInput ] = int.values;
                const category = categories.find(c => c.name.toLowerCase() == catInput);
                embeds = getEmbeds(category, client.config);
                const needPagination = embeds.length > 1;

                int.update({
                    embeds: [embeds[0]],
                    components: [
                        menu(categories, false, category.name),
                        buttons(!needPagination)
                    ]
                });
            })
            .on('end', () => {
                sent.edit({ components: [menu(categories, false, 'Interaction Timed Out'), buttons(true)] });
            });

        sent.createMessageComponentCollector({ 
            filter: (int: ButtonInteraction) => {
                if (int.user.id == message.author.id) return true;
                else {
                    int.reply({ content: 'This is not for you!', ephemeral: true });
                    return false;
                }
            },
            componentType: 'BUTTON',
            time: 30000
        })
            .on('collect', int => {
                if (!embeds) return;

                currentPageIndex = newIndex(currentPageIndex, int.customId, embeds.length);

                int.update({ embeds: [embeds[currentPageIndex]] });
            })

    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [

    ],
    async run(client, interaction, options, data) {
        const allCategories = [...new Set(client.commands.map(c => c.category))];

        const categories = allCategories.map(cat => {
            return {
                name: cat,
                commands: client.commands
                    .filter(cmd => cmd.category == cat)
                    .map(c => c)
            } as CommandCategory;
        });

        const embed = new MessageEmbed().setTitle('Choose a category:')
            .setColor(client.config.color)

        const message = await interaction.editReply({ embeds: [embed], components: [menu(categories, false), buttons(true)] }) as Message;

        let currentPageIndex = 0;
        let embeds: MessageEmbed[];

        message.createMessageComponentCollector({ 
            filter: (int: SelectMenuInteraction) => filter(int, interaction.user.id),
            componentType: 'SELECT_MENU',
            time: 30000
        })
            .on('collect', int => {
                currentPageIndex = 0;
                const [ catInput ] = int.values;
                const category = categories.find(c => c.name.toLowerCase() == catInput);
                embeds = getEmbeds(category, client.config);
                const needPagination = embeds.length > 1;

                int.update({
                    embeds: [embeds[0]],
                    components: [
                        menu(categories, false, category.name),
                        buttons(!needPagination)
                    ]
                });
            })
            .on('end', () => {
                interaction.editReply({ components: [menu(categories, false, 'Interaction Timed Out'), buttons(true)] });
            });

        message.createMessageComponentCollector({ 
            filter: (int: ButtonInteraction) => {
                if (int.user.id == interaction.user.id) return true;
                else {
                    int.reply({ content: 'This is not for you!', ephemeral: true })
                    return false;
                }
            },
            componentType: 'BUTTON',
            time: 30000
        })
            .on('collect', int => {
                if (!embeds) return;

                currentPageIndex = newIndex(currentPageIndex, int.customId, embeds.length);

                int.update({ embeds: [embeds[currentPageIndex]] });
            })

    }
}

export default command;