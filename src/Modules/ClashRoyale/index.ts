export { ClashProfile } from './ClashProfile';
export { ClashChests } from './ClashChests';
export { ClashWarWeek } from './ClashWarWeek';

import fetch from 'node-fetch';

export async function ClashRoyaleAPI(url: string, token: string) {
    const data = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return data;
}
