import { GuildMember, Guild, Interaction, PermissionString, CommandInteractionOption, TextChannel } from 'discord.js';
import { Event, SlashCommand_Data } from '../Interfaces';

export const event: Event = {
    name: 'interactionCreate',
    async run(client, interaction: Interaction) {
        // Slash Command Handling
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const slashCommand = client.slashCommands.get(interaction.commandName);
        if (!slashCommand) return interaction.followUp({ content: 'Unknown command.' });

        if (!client.services.slashCommands) {
            return interaction.followUp('This feature is currently out of service.');
        }

        const options: CommandInteractionOption[] = [];

        for (const option of interaction.options.data) {
            options.push(option);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        const data: SlashCommand_Data = {
            userCache: await client.database.cache.fetchUserCache(interaction.user),
            guildCache: await client.database.cache.fetchGuildCache(interaction.guild),
        }

        //If command is owner only and author isn't owner return
        if (slashCommand.ownerOnly && interaction.user.id !== client.secrets.OWNER_ID) {
            return;
        }
        //If command is op only and author isn't op return
        if (slashCommand.opOnly && !data.userCache.OP) {
            return;
        }

        let userPerms: PermissionString[] = [];
        //Checking for members permission
        slashCommand.memberPerms?.forEach((perm) => {
            if ((interaction.channel as TextChannel).permissionsFor(interaction.member as GuildMember).has(perm)) {
                userPerms.push(perm);
            }
        });

        //If user permissions arraylist length is more than zero return error
        if (userPerms.length > 0) {
            return interaction.followUp(
                'Looks like you\'re missing the following permissions:\n' +
                    userPerms.map((p) => `\`${p}\``).join(', ')
            );
        }

        let clientPerms: PermissionString[] = [];
        //Checking for client permissions
        slashCommand.clientPerms?.forEach((perm) => {
            if ((interaction.channel as TextChannel).permissionsFor((interaction.guild as Guild).me as GuildMember).has(perm)) {
                clientPerms.push(perm);
            }
        });

        //If client permissions arraylist length is more than zero return error
        if (clientPerms.length > 0) {
            return interaction.followUp(
                'Looks like I\'m missing the following permissions:\n' +
                    clientPerms.map((p) => `\`${p}\``).join(', ')
            );
        }

        try {
            slashCommand.run(client, interaction, options, data);
        } catch (err) {
            const errMsg = `Error While Executing command '${slashCommand.name}'. Error: ${err}`;
            console.log(errMsg);
            interaction.followUp('There was an error executing that command.');
        }
    }
}