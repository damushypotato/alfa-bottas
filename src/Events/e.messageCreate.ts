import { GuildMember, Guild ,Message, PermissionString } from 'discord.js';
import { Event, TextCommand_Data } from '../Structures/Interfaces';

export const event: Event = {
    name: 'messageCreate',
    async run(client, message: Message) {
        // no bots
        if (message.author.bot) return;
        // only guilds
        if (!message.guild) return;
        // only guild text channels
        if (!(message.channel.type == 'GUILD_TEXT')) return;

        //Get cached guild prefix
        const guildCache = await client.database.cache.fetchGuildCache(message.guild);

        let prefix = guildCache.prefix;
        //Check if message starts with the prefix
        if (!message.content.toLowerCase().startsWith(prefix)) {
            // if directly mentioned
            if (message.content.startsWith(`<@!${message.client.user?.id}>`) ||
                message.content.startsWith(`<@${message.client.user?.id}>`)) {
                return message.channel.send(
                    `What? btw the prefix is \'${prefix}\'.`
                );
            }
            return;
        }

        // get args / other data
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase() as string;
        const fullArgs = message.content.slice(prefix.length + commandName.length).trim();
        // get command
        const command = client.commands.get(commandName) || client.commands.find(c => c.textCommand?.aliases?.includes(commandName) || false);
        //Checking if the message is a command
        if (!command) return;
        else if (!command.textCommand) {
            // check if it is a text command
            return message.channel.send(`That is not a command. Use \`/${command.name}\` instead.`);
        }

        if (!client.services.commands) {
            if (command.name != 'services') {
                return message.channel.send('This feature is currently out of service.');
            }
        }

        const data: TextCommand_Data = {
            userCache: await client.database.cache.fetchUserCache(message.author),
            guildCache,
            prefix,
            fullArgs
        };
        
        //If command is owner only and author isn't owner return
        if (command.ownerOnly && message.author.id !== client.secrets.OWNER_ID) {
            return;
        }
        //If command is op only and author isn't op return
        if (command.opOnly && !data.userCache.OP) {
            return;
        }

        const userPerms: PermissionString[] = command.memberPerms?.map(perm => {
            if (message.channel.type == 'GUILD_TEXT' && !message.channel.permissionsFor(message.member).has(perm)) {
                return perm;
            }
        });
        if (userPerms.length > 0) {
            return message.channel.send(
                'Looks like you\'re missing the following permissions:\n' +
                    userPerms.map(p => `\`${p}\``).join(', ')
            );
        }

        const clientPerms: PermissionString[] = command.clientPerms?.map(perm => {
            if (message.channel.type == 'GUILD_TEXT' && !message.channel.permissionsFor(message.guild.me).has(perm)) {
                return perm;
            }
        });
        if (clientPerms.length > 0) {
            return message.channel.send(
                'Looks like I\'m missing the following permissions:\n' +
                    clientPerms.map(p => `\`${p}\``).join(', ')
            );
        }

        try {
            command.textCommand.run(client, message, args, data);
        } catch (err) {
            const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
            console.log(errMsg);
        }
    }
}