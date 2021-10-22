import { Filter } from '../Structures/Interfaces';

export const triggers: string[] = ['ur mom', 'ur mum', 'ur mother', 'your mom', 'your mum', 'your mother'];

export const filter: Filter = {
    name: 'urmom',
    async evaluate(client, message) {
        const text = message.content.toLowerCase();
        for (const i in triggers) {
            const trigger = triggers[i];
            if (text.includes(trigger)) {
                message.channel.send(
                    'SHUT THE FUCK UP ITS NOT FUNNY OMG I SWEAR IF ONE OF YOU FUCKING FUCKERS SAY THAT ONE MORE TIME IMMA WHOOP UR ASS BOI'
                );
                break;
            }
        }
        return true;
    },
};
