import { ChannelType, Message } from 'discord.js';
import { Event } from '../Types';

export const event: Event = {
    name: 'messageCreate',
    async run(client, message: Message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!(message.channel.type == ChannelType.GuildText)) return;

        // const guildCache = await client.database.cache.fetchGuildCache(message.guild);

        // // let prefix = guildCache.prefix;

        // if (!message.content.toLowerCase().startsWith(prefix)) {
        //     // if directly mentioned
        //     if (
        //         message.content.startsWith(`<@!${message.client.user?.id}>`) ||
        //         message.content.startsWith(`<@${message.client.user?.id}>`)
        //     ) {
        //         return message.channel.send(`What? btw the prefix is \'${prefix}\'.`);
        //     }

        //     // validate message / other stuff

        if (client.services.filters) {
            let pass = true;
            for (const i of client.filters) {
                const filter = i[1];
                if (!filter.enabled) break;
                const result = await filter.evaluate(client, message);
                if (!result) pass = false;
            }
            if (!pass) {
                return;
            }
        }

        //     return;
        // }

        // // get args / other data
        // const args = message.content.slice(prefix.length).trim().split(/ +/g);
        // const commandName = args.shift()?.toLowerCase() as string;

        // const userCache = await client.database.cache.fetchUserCache(message.author);

        // if (commandName == 'services') {
        //     return message.channel.send('This feature is currently out of service.');
        // }
    },
};
