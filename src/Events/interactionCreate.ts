import { Interaction, PermissionsString } from 'discord.js';
import { CommandContext } from '../Structures/Command';
import { Event } from '../Types';

export const event: Event = {
    name: 'interactionCreate',
    async run(client, interaction: Interaction) {
        if (!interaction.isCommand() && !interaction.isAutocomplete()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        if (interaction.isAutocomplete()) {
            try {
                command.autocomplete(client, interaction);
            } catch (err) {
                const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
                console.log(errMsg);
            }
        } else if (interaction.isChatInputCommand()) {
            if (!client.services.commands) {
                if (command.name != 'services')
                    return interaction.reply('This feature is currently out of service.');
            }

            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            const [guildCache, userCache] = await Promise.all([
                client.database.cache.fetchGuildCache(interaction.guild),
                client.database.cache.fetchUserCache(interaction.user),
            ]);

            const ctx = new CommandContext(interaction, client);

            if (command.ephemeralDefer) {
                await interaction
                    .deferReply({
                        ephemeral: await command.ephemeralDefer(
                            client,
                            interaction,
                            interaction.options,
                            ctx,
                            userCache,
                            guildCache
                        ),
                    })
                    .catch(() => {});
            } else {
                await interaction.deferReply();
            }

            if (command.ownerOnly && interaction.user.id !== client.secrets.OWNER_ID) {
                return;
            }
            if (command.opOnly && !userCache.OP) {
                return;
            }

            const userPerms: PermissionsString[] = command.memberPerms?.filter(perm => {
                return !interaction.guild.members.cache
                    .get(interaction.user.id)
                    .permissions.has(perm);
            });
            if (userPerms?.length > 0) {
                return interaction.followUp(
                    "Looks like you're missing the following permissions:\n" +
                        userPerms.map(p => `\`${p}\``).join(', ')
                );
            }

            const clientPerms: PermissionsString[] = command.clientPerms?.filter(async perm => {
                return !(await interaction.guild.members.fetchMe()).permissions.has(perm);
            });
            if (clientPerms?.length > 0) {
                return interaction.followUp(
                    "Looks like I'm missing the following permissions:\n" +
                        clientPerms.map(p => `\`${p}\``).join(', ')
                );
            }

            try {
                command.run(client, interaction, interaction.options, ctx, userCache, guildCache);
            } catch (err) {
                const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
                console.log(errMsg);
                interaction.followUp('There was an error executing that command.');
            }
        }
    },
};
