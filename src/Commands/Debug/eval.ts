import { ApplicationCommandOptionType } from 'discord.js';
import { inspect } from 'util';
import Command from '../../Structures/Command';

export default new Command({
    name: 'eval',
    description: 'Evaluate code.',
    ownerOnly: true,
    options: [
        {
            name: 'code',
            description: 'The JS code to evaluate.',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'secret',
            description: 'Hide in chat? Default true',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
        {
            name: 'output',
            description: 'Show output? Default true',
            type: ApplicationCommandOptionType.Boolean,
            required: false,
        },
    ],
    run: async (client, int, options, ctx, userCache, guildCache) => {
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
                ctx.send(final);
            } else {
                ctx.send('Evaluated content is too long to display.');
            }
        } else {
            ctx.send('Done.');
        }
    },
});
