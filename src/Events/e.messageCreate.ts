import { GuildMember, Guild ,Message, PermissionString } from "discord.js";
import { Event } from "../Interfaces";
import { Command_Data } from "../Interfaces/Command_Data";
import { GuildDoc } from "../Types/Database";

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
        const guildCache = client.database.cache.guildCache.get(message.guildId);

        let prefix: string;

        let guildDB: GuildDoc;
        if (!guildCache) {
            guildDB = await client.database.fetchGuildDB(message.guild);
            prefix = guildDB.prefix || client.config.prefix;
        }
        else {
            prefix = guildCache.prefix;
        }

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

        if (!guildDB) {
            guildDB = await client.database.fetchGuildDB(message.guild);
        }

        //Get the user database
        const userDB = await client.database.fetchUserDB(message.author);
        //get member database
        const memberDB = await client.database.fetchMemberDB(userDB._id, guildDB._id);

        const data: Command_Data = {
            userDB,
            guildDB,
            memberDB,
            command,
            prefix
        };

        //If command is owner only and author isn't owner return
        if (command.ownerOnly && message.author.id !== client.secrets.OWNER_ID) {
            return;
        }
        //If command is op only and author isn't op return
        if (command.opOnly && !userDB.OP) {
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
                "Looks like you're missing the following permissions:\n" +
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
                "Looks like I'm missing the following permissions:\n" +
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