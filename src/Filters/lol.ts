import { Filter } from '../Types';

const LMAO = (): string => {
    const responses = [
        'LMAO',
        'ROFL',
        'LOL!!!!',
        'bro im dying rn LMAOOOOO',
        'lol',
        ':joy:',
        ':rofl:',
        ':joy::joy::joy:',
        ':rofl::rofl::rofl::joy:',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
};

export const filter: Filter = {
    name: 'lol',
    enabled: true,
    async evaluate(client, message) {
        if (message.content.toLowerCase() == 'lol')
            for (let i = 0; i < 10; i++) await message.channel.send(LMAO());
        return true;
    },
};
