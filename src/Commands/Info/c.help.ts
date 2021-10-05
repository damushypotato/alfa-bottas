import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, EmbedFieldData, ButtonInteraction, MessageButton } from 'discord.js'
import { Command, Command_Category } from '../../Interfaces';

export const command: Command = {
    name: 'help',
    description: 'Shows the help command',
    usage: 'help',
    async run(client, message, args, data) {
        const allCategories = [...new Set(client.commands.map(c => c.category))];

        const categories = allCategories.map(cat => {
            return {
                name: cat,
                commands: client.commands
                    .filter(cmd => cmd.category == cat)
                    .map(c => c)
            } as Command_Category;
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


        const sent = await message.channel.send({ embeds: [embed], components: [menu(false), buttons(false)] })

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

        message.channel.createMessageComponentCollector({ 
            filter: (interaction: SelectMenuInteraction) => interaction.user.id == message.author.id,
            componentType: 'SELECT_MENU',
            time: 30000
        })
            .on('collect', interaction => {
                currentPageIndex = 0;

                const [ catInput ] = interaction.values;
                const category = categories.find(c => c.name.toLowerCase() == catInput);
                const commands = [...category.commands];

                embeds = (chunk(commands, 5) as Command[][]).map((cmds, i, a) => {
                    return new MessageEmbed()
                    .setTitle(`${category.name} Commands`)
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

                interaction.update({
                    embeds: [embeds[0]],
                    components: [
                        menu(false, category.name),
                        buttons(!needPagination)
                    ]
                });
            })
            .on('end', () => {
                sent.edit({ components: [menu(true, 'Interaction Timed Out'), buttons(true)] });
            });

        message.channel.createMessageComponentCollector({ 
            filter: (interaction: ButtonInteraction) => interaction.user.id == message.author.id,
            componentType: 'BUTTON',
            time: 30000
        })
            .on('collect', interaction => {

                const id = interaction.customId;

                if (!embeds) return;

                const savedIndex = currentPageIndex;

                if (id == 'back-btn') {
                    currentPageIndex--;
                }
                else if (id == 'next-btn') {
                    currentPageIndex++;
                }

                currentPageIndex = Math.abs(embeds.length + currentPageIndex) % embeds.length;

                interaction.update({ embeds: [embeds[currentPageIndex]] });
            })

    }
}
