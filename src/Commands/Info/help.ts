import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    Message,
    SelectMenuBuilder,
    SelectMenuInteraction,
} from 'discord.js';
import { Chunk } from '../../Modules/Tools';
import Command from '../../Structures/Command';
import { CommandCategory } from '../../Types';

const menu = (categories: CommandCategory[], disabled: boolean, placeholder?: string) =>
    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
        new SelectMenuBuilder()
            .setCustomId('help-menu')
            .setPlaceholder(placeholder ?? 'Select one...')
            .setDisabled(disabled)
            .addOptions(
                categories.map(c => {
                    return {
                        label: c.name,
                        value: c.name.toLowerCase(),
                        description: `Commands from the ${c.name} category`,
                    };
                })
            )
    );

const buttons = (disabled: boolean) =>
    new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setEmoji('◀️')
            .setCustomId('back-btn')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled),
        new ButtonBuilder()
            .setEmoji('▶️')
            .setCustomId('next-btn')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(disabled)
    );

export default new Command({
    name: 'help',
    description: 'Shows the list of commands.',
    ownerOnly: false,
    options: [],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const allCategories = [...new Set(client.commands.map(c => c.category))];

        const categories = allCategories.map(cat => {
            return {
                name: cat,
                commands: client.commands.filter(cmd => cmd.category == cat).map(c => c),
            } as CommandCategory;
        });

        const embed = client.newEmbed({ title: 'Choose a category:' });

        const message = await int.editReply({
            embeds: [embed],
            components: [menu(categories, false), buttons(true)],
        });

        let currentPageIndex = 0;
        let embeds: EmbedBuilder[];

        message
            .createMessageComponentCollector({
                filter: (sInt: SelectMenuInteraction) => {
                    if (sInt.user.id == int.user.id) return true;
                    else {
                        sInt.reply({ content: 'This is not for you!', ephemeral: true });
                        return false;
                    }
                },
                componentType: ComponentType.SelectMenu,
                time: 60000,
            })
            .on('collect', sInt => {
                currentPageIndex = 0;
                const [catInput] = sInt.values;
                const category = categories.find(c => c.name.toLowerCase() == catInput);

                const commands = [...category.commands];

                embeds = Chunk.default<Command>(commands, 5).map((cmds, i, a) =>
                    client.newEmbed({
                        title: `${category.name} Commands`,
                        footer: {
                            text: `${client.config.embed_footer} | Page ${i + 1} of ${a.length}`,
                        },
                        fields: cmds.map(c => {
                            return {
                                name: `\`${c.name}\``,
                                value: c.description,
                                inline: false,
                            };
                        }),
                    })
                );
                const needPagination = embeds.length > 1;

                sInt.update({
                    embeds: [embeds[0]],
                    components: [menu(categories, false, category.name), buttons(!needPagination)],
                });
            })
            .on('end', () => {
                int.editReply({
                    components: [menu(categories, false, 'Interaction Timed Out'), buttons(true)],
                });
            });

        message
            .createMessageComponentCollector({
                filter: (bInt: ButtonInteraction) => {
                    if (bInt.user.id == int.user.id) return true;
                    else {
                        bInt.reply({
                            content: 'This is not for you!',
                            ephemeral: true,
                        });
                        return false;
                    }
                },
                componentType: ComponentType.Button,
                time: 60000,
            })
            .on('collect', bInt => {
                if (!embeds) return;

                let i = currentPageIndex;
                if (bInt.customId == 'back-btn') {
                    i--;
                } else if (bInt.customId == 'next-btn') {
                    i++;
                }

                currentPageIndex = Math.abs(embeds.length + i) % embeds.length;

                bInt.update({ embeds: [embeds[currentPageIndex]] });
            });
    },
});
