import { Interaction, PermissionString, CommandInteractionOption } from 'discord.js';
import { SlashCommandContext } from '../Structures/Command/Slash';
import { Event } from '../Types';

export const event: Event = {
    name: 'interactionCreate',
    async run(client, interaction: Interaction) {
        // Slash Command Handling
        if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        if (interaction.isAutocomplete()) {
            try {
                command.slashCommand.autocomplete(client, interaction);
            } catch (err) {
                const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
                console.log(errMsg);
            }
        } else {
            if (!command.slashCommand) {
                const { prefix } = await client.database.cache.fetchGuildCache(interaction.guild);
                return interaction.reply(
                    `That is not a command. Use \`${prefix}${command.name}\` instead.`
                );
            }

            if (!client.services.slashCommands) {
                return interaction.reply('This feature is currently out of service.');
            }

            const optionsArray: CommandInteractionOption[] = [];

            for (const option of interaction.options.data) {
                optionsArray.push(option);
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            const userCache = await client.database.cache.fetchUserCache(interaction.user);
            const guildCache = await client.database.cache.fetchGuildCache(interaction.guild);

            const ctx = new SlashCommandContext(client, interaction, userCache, guildCache);

            if (command.slashCommand.ephemeralDefer) {
                await interaction
                    .deferReply({
                        ephemeral: await command.slashCommand.ephemeralDefer(ctx),
                    })
                    .catch(() => {});
            } else {
                await interaction.deferReply();
            }

            //If command is owner only and author isn't owner return
            if (command.ownerOnly && interaction.user.id !== client.secrets.OWNER_ID) {
                return;
            }
            //If command is op only and author isn't op return
            if (command.opOnly && !ctx.userCache.OP) {
                return;
            }

            const userPerms: PermissionString[] = command.memberPerms?.filter(perm => {
                return !interaction.guild.members.cache
                    .get(interaction.user.id)
                    .permissions.has(perm);
            });
            if (userPerms.length > 0) {
                return interaction.followUp(
                    "Looks like you're missing the following permissions:\n" +
                        userPerms.map(p => `\`${p}\``).join(', ')
                );
            }

            const clientPerms: PermissionString[] = command.clientPerms?.filter(perm => {
                return !interaction.guild.me.permissions.has(perm);
            });
            if (clientPerms.length > 0) {
                return interaction.followUp(
                    "Looks like I'm missing the following permissions:\n" +
                        clientPerms.map(p => `\`${p}\``).join(', ')
                );
            }

            try {
                command.slashCommand.run(ctx);
            } catch (err) {
                const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
                console.log(errMsg);
                interaction.followUp('There was an error executing that command.');
            }
        }
    },
};
