import { GuildMember, Guild ,Message, PermissionString } from 'discord.js';
import { Event, Command_Data } from '../Interfaces';

export const event: Event = {
    name: 'messageCreate',
    async run(client, message: Message) {
        // no bots
        if (message.author.bot) return;
        
        // only guilds
        if (!message.guild) return;
        // only text channels
        if (!(message.channel.type == 'GUILD_TEXT')) return;

        //Get cached guild prefix
        const guildCache = await client.database.cache.fetchGuildCache(message.guild);

        let prefix = guildCache.prefix;

        //Check if message starts with the prefix
        if (!message.content.toLowerCase().startsWith(prefix)) {
            // if directly pinged
            if (message.content === `<@!${message.client.user?.id}>` || message.content === `<@${message.client.user?.id}>`) {
                return message.channel.send(
                    `What? btw the prefix is \'${prefix}\'.`
                );
            }
            return;
        }

        //Checking if the message is a command
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase() as string;
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases?.includes(commandName) || false);

        //If it isn't a command then return
        if (!command) return;

        if (!client.services.commands) {
            if (command.name != 'services') {
                return message.channel.send('This feature is currently out of service.');
            }
        }

        const data: Command_Data = {
            userCache: await client.database.cache.fetchUserCache(message.author),
            guildCache,
            prefix
        };
        
        //If command is owner only and author isn't owner return
        if (command.ownerOnly && message.author.id !== client.secrets.OWNER_ID) {
            return;
        }
        //If command is op only and author isn't op return
        if (command.opOnly && !data.userCache.OP) {
            return;
        }

        let userPerms: PermissionString[] = [];
        //Checking for members permission
        command.memberPerms?.forEach((perm) => {
            if (message.channel.type == 'GUILD_TEXT' && !message.channel.permissionsFor(message.member as GuildMember).has(perm)) {
                userPerms.push(perm);
            }
        });

        //If user permissions arraylist length is more than zero return error
        if (userPerms.length > 0) {
            return message.channel.send(
                'Looks like you\'re missing the following permissions:\n' +
                    userPerms.map((p) => `\`${p}\``).join(', ')
            );
        }

        let clientPerms: PermissionString[] = [];
        //Checking for client permissions
        command.clientPerms?.forEach((perm) => {
            if (message.channel.type == 'GUILD_TEXT' && !message.channel.permissionsFor((message.guild as Guild).me as GuildMember).has(perm)) {
                clientPerms.push(perm);
            }
        });

        //If client permissions arraylist length is more than zero return error
        if (clientPerms.length > 0) {
            return message.channel.send(
                'Looks like I\'m missing the following permissions:\n' +
                    clientPerms.map((p) => `\`${p}\``).join(', ')
            );
        }

        try {
            command.run(client, message, args, data);
        } catch (err) {
            const errMsg = `Error While Executing command '${command.name}'. Error: ${err}`;
            console.log(errMsg);
            message.channel.send('There was an error executing that command.');
        }
    }
}