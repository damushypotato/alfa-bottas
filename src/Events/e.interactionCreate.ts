import { GuildMember, Guild, Interaction, PermissionString, CommandInteractionOption, TextChannel } from 'discord.js';
import { Event, SlashCommand_Data } from '../Structures/Interfaces';

export const event: Event = {
    name: 'interactionCreate',
    async run(client, interaction: Interaction) {
        // Slash Command Handling
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.followUp({ content: 'Unknown command.' });
        
        if (!command.slashCommand) {
            const { prefix } = await client.database.cache.fetchGuildCache(interaction.guild);
            return interaction.followUp(`That is not a command. Use \`${prefix}${command.name}\` instead.`)
        }

        if (!client.services.slashCommands) {
            return interaction.followUp('This feature is currently out of service.');
        }

        const optionsArray: CommandInteractionOption[] = [];

        for (const option of interaction.options.data) {
            optionsArray.push(option);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        const data: SlashCommand_Data = {
            userCache: await client.database.cache.fetchUserCache(interaction.user),
            guildCache: await client.database.cache.fetchGuildCache(interaction.guild),
            optionsArray
        }

        //If command is owner only and author isn't owner return
        if (command.ownerOnly && interaction.user.id !== client.secrets.OWNER_ID) {
            return;
        }
        //If command is op only and author isn't op return
        if (command.opOnly && !data.userCache.OP) {
            return;
        }

        const userPerms: PermissionString[] = command.memberPerms?.map(perm => {
            if (!(interaction.channel as TextChannel).permissionsFor(interaction.member as GuildMember).has(perm)) {
                return perm;
            }
        });
        if (userPerms.length > 0) {
            return interaction.followUp(
                'Looks like you\'re missing the following permissions:\n' +
                    userPerms.map(p => `\`${p}\``).join(', ')
            );
        }

        const clientPerms: PermissionString[] = command.clientPerms?.map(perm => {
            if (!(interaction.channel as TextChannel).permissionsFor(interaction.guild.me).has(perm)) {
                return perm;
            }
        });
        if (clientPerms.length > 0) {
            return interaction.followUp(
                'Looks like I\'m missing the following permissions:\n' +
                    clientPerms.map(p => `\`${p}\``).join(', ')
            );
        }

        try {
            command.slashCommand.run(client, interaction, interaction.options, data);
        } catch (err) {
            const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
            console.log(errMsg);
            interaction.followUp('There was an error executing that command.');
        }
    }
}