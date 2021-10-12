import {  } from 'discord.js';
import Command from '../../Modules/Command';

const maxLength = 8;

const command = new Command({
    name: 'op',
    description: 'Set op status for a user.',
    ownerOnly: true
});

command.textCommand = {
    usage: '<@User> <true | false>',
    async run(client, message, [ mention, opStatus ], data) {

        const target = client.tools.mentions.getUserFromMention(mention, client);
        if (!target) return command.sendUsage(message, data.prefix);
        
        const sent_fetching = message.channel.send('Fetching user...');
        
        const db_req = client.database.fetchUserDB(target);

        const [sent, userDB] = await Promise.all([sent_fetching, db_req]);

        if (opStatus == null) {
            return sent.edit(`${target} is ${userDB.OP ? '' : 'not '}OP.`);
        }

        if (opStatus != 'true' && opStatus != 'false') {
            return command.sendUsage(sent, data.prefix, true);
        }

        const op = opStatus == 'true'; 

        if (op == userDB.OP) return sent.edit(`Already set!`);

        userDB.OP = op;
        await userDB.save();
        client.database.cache.fetchAndUpdateUser(userDB);

        sent.edit(`${target} now set to ${userDB.OP ? '' : 'not '}OP.`);
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to set.',
            type: 'USER',
            required: true
        },
        {
            name: 'op',
            description: 'OP status.',
            type: 'BOOLEAN',
            required: false
        }
    ],
    async run(client, interaction, options, data) {

        const target = options.getUser('user');

        if (!target) {
            return interaction.followUp('User not found.')
        }

        const opStatus = options.getBoolean('op');

        const userDB = await client.database.fetchUserDB(target);

        if (opStatus == null) {
            return interaction.followUp(`${target} is ${userDB.OP ? '' : 'not '}OP.`);
        }

        if (opStatus == userDB.OP) return interaction.followUp(`Already set!`);

        userDB.OP = opStatus;
        await userDB.save();
        client.database.cache.fetchAndUpdateUser(userDB);

        interaction.followUp(`${target} now set to ${userDB.OP ? '' : 'not '}OP.`);
    }
}

export default command;