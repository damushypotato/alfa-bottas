import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, EmbedFieldData, ButtonInteraction, MessageButton, Message } from 'discord.js'
import { SlashCommand, SlashCommand_Category } from '../../Structures/Interfaces';

export const slashCommand: SlashCommand = {
    name: 'help',
    description: 'The help menu for slash commands',
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const allCategories = [...new Set(client.slashCommands.map(c => c.category))];

        const categories = allCategories.map(cat => {
            return {
                name: cat,
                commands: client.slashCommands
                    .filter(cmd => cmd.category == cat)
                    .map(c => c)
            } as SlashCommand_Category;
        });

        const embed = new MessageEmbed().setTitle('Choose a category:')
            .setColor(client.config.color)

        const menu = (disabled: boolean, placeholder?: string) => new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('help-menu')
                .setPlaceholder(placeholder || 'Select one...')
                .setDisabled(disabled)
                .addOptions(categories.map(c => {
                    return {
                        label: c.name,
                        value: c.name.toLowerCase(),
                        description: `Slash Commands from the ${c.name} category`
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

        const message = await interaction.editReply({ embeds: [embed], components: [menu(false), buttons(true)] }) as Message;

        const chunk = (array: any[], max: number) => {
            const a = [...array];
            const results: any[][] = [];
            while (a.length) {
                results.push(a.splice(0, max));
            }
            return results;
        }

        let currentPageIndex = 0;
        let embeds: MessageEmbed[];

        message.createMessageComponentCollector({ 
            filter: (int: SelectMenuInteraction) => {
                if (int.user.id == interaction.user.id) return true;
                else {
                    int.reply({ content: 'This is not for you!', ephemeral: true })
                    return false;
                }
            },
            componentType: 'SELECT_MENU',
            time: 30000
        })
            .on('collect', int => {
                currentPageIndex = 0;

                const [ catInput ] = int.values;
                const category = categories.find(c => c.name.toLowerCase() == catInput);
                const commands = [...category.commands];

                embeds = (chunk(commands, 5) as SlashCommand[][]).map((cmds, i, a) => {
                    return new MessageEmbed()
                    .setTitle(`${category.name} Slash Commands`)
                    .setColor(client.config.color)
                    .setFooter(`${client.config.embed_footer} | Page ${i + 1} of ${a.length}`)
                    .addFields(cmds.map(c => {
                        return {
                            name: `\`${c.name}\``,
                            value: c.description,
                            inline: false
                        } as EmbedFieldData
                    }));
                });

                const needPagination = embeds.length > 1;

                int.update({
                    embeds: [embeds[0]],
                    components: [
                        menu(false, category.name),
                        buttons(!needPagination)
                    ]
                });
            })
            .on('end', () => {
                interaction.editReply({ components: [menu(true, 'Interaction Timed Out'), buttons(true)] });
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

                const id = int.customId;

                if (!embeds) return;

                if (id == 'back-btn') {
                    currentPageIndex--;
                }
                else if (id == 'next-btn') {
                    currentPageIndex++;
                }

                currentPageIndex = Math.abs(embeds.length + currentPageIndex) % embeds.length;

                int.update({ embeds: [embeds[currentPageIndex]] });
            })

    }
}
