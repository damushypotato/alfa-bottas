import { Message } from 'discord.js';
import { inspect } from 'util';
import Command from '../../Modules/Command';

const command = new Command({
    name: 'eval',
    description: 'Evaluate some code. (OWNER ONLY)',
    ownerOnly: true,
});

// command.textCommand = {
//     usage: '<JS code>',
//     async run(client, message, args, { fullArgs, prefix }) {
//         if (!fullArgs) return command.sendUsage(message, prefix);

//         const code = fullArgs;

//         let output;
//         try {
//             let result;
//             try {
//                 result = await eval(code);
//             } catch (error) {
//                 result = error;
//             }
//             output = result;
//             if (typeof result != 'string') {
//                 output = inspect(result);
//             }

//             output = `\`\`\`JS\n${output}\n\`\`\``;

//             await message.author.send(output);
//         } catch (error) {
//             message.author.send('Evaluated content is too long to display.');
//         }
//     },
// };

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
        {
            name: 'output',
            description: 'Show output? Default true',
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

        const outputOpt = options.getBoolean('output');
        const showOutput = outputOpt == null ? true : outputOpt;

        let result: any;
        try {
            result = await eval(code);
        } catch (error) {
            result = error;
        }

        if (showOutput) {
            let output = result;
            if (typeof result != 'string') {
                output = inspect(result);
            }
            const final = `\`\`\`JS\n${output}\n\`\`\``;
            if (final.length <= 2000) {
                interaction.followUp(final);
            } else {
                interaction.followUp(
                    'Evaluated content is too long to display.'
                );
            }
        } else {
            interaction.followUp('Done.');
        }
    },
};

export default command;
