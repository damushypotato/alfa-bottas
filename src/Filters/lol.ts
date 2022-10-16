import { Filter } from '../Types';

// stfu this is for that one guy who keeps saying lol for everything

const emojis = [':joy:', ':rofl:', ':skull:'];

const responses = [
    'LMAO',
    'ROFL',
    'LOL!!!!',
    'bro im dying rn LMAOOOOO',
    'lol',
    'lmao',
    'LMAO!!!!!!!!',
    'LOLOLOLOLOL',
    'LEL!',
    'XDDDZXSS',
];

const emojiLmao = (length: number): string => {
    let response = '';
    for (let i = 0; i < length; i++) {
        response += emojis[Math.floor(Math.random() * emojis.length)];
    }
    return response;
};

const LMAO = (): string => {
    let response = '';
    // chance of text
    if (Math.random() < 0.5) {
        response = responses[Math.floor(Math.random() * responses.length)];
    } else {
        // chance of emoji
        response = emojiLmao(Math.floor(Math.random() * 6) + 1);
    }
    return response;
};

export const filter: Filter = {
    name: 'lol',
    enabled: true,
    async evaluate(client, message) {
        const n = Math.floor(Math.random() * 8) + 5;
        if (
            message.content
                .toLowerCase()
                .replace(/[0e]/g, 'o')
                .replace(/[.,]/g, '')
                .split(' ')
                .join('')
                .includes('lol')
        )
            for (let i = 0; i < n; i++) await message.channel.send(LMAO());
        return true;
    },
};
