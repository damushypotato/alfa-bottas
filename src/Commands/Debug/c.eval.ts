import { Message } from 'discord.js';
import { inspect } from 'util';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'eval',
    description: 'Evaluate some code. (OWNER ONLY)',
    ownerOnly: true,
});

command.textCommand = {
    usage: '<JS code>',
    async run(client, message, args, { fullArgs, prefix }) {
        if (!fullArgs) return command.sendUsage(message, prefix);

        const code = fullArgs;

        let output;
        try {
            let result;
            try {
                result = await eval(code);
            } catch (error) {
                result = error;
            }
            output = result;
            if (typeof result != 'string') {
                output = inspect(result);
            }

            output = `\`\`\`JS\n${output}\n\`\`\``;

            await message.author.send(output);
        } catch (error) {
            message.author.send('Evaluated content is too long to display.');
        }
    },
};

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'code',
            description: 'The JS code to evaluate.',
            type: 'STRING',
            required: true,
        },
        {
            name: 'secret',
            description: 'Hide in chat? Default true',
            type: 'BOOLEAN',
            required: false,
        },
    ],
    async ephemeralDefer(client, interaction) {
        const secret = interaction.options.getBoolean('secret');

        return secret == null ? true : secret;
    },
    async run(client, interaction, options, data) {
        const code = options.getString('code');

        let output;
        try {
            let result;
            try {
                result = await eval(code);
            } catch (error) {
                result = error;
            }
            output = result;
            if (typeof result != 'string') {
                output = inspect(result);
            }

            output = `\`\`\`JS\n${output}\n\`\`\``;

            interaction.followUp('Done.');
            interaction.user.send(output);
        } catch (error) {
            interaction.followUp('Done.');
            interaction.user.send('Evaluated content is too long to display.');
        }
    },
};

export default command;
