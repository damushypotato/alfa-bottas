import {} from 'discord.js';
import { Config } from '../../Structures/Interfaces';
import { GetRoast } from '../../Modules/APIs/Roast';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'roast',
    description: 'U suck',
});

command.textCommand = {
    usage: '',
    async run(client, message, args, data) {
        const roast = await GetRoast();

        if (!roast) message.channel.send({ embeds: [client.apiFailEmbed()] });

        message.channel.send(roast);
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const roast = await GetRoast();

        if (!roast) interaction.followUp({ embeds: [client.apiFailEmbed()] });

        interaction.followUp(roast);
    },
};

export default command;
