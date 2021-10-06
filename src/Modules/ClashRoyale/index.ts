export { Profile } from './Profile';
export { Chests } from './Chests';
export { War }  from './War';
export { HashtagHelper } from './HashtagHelper';

import fetch from 'node-fetch';

export async function ClashRoyaleAPI(url: string, token: string) {
    const data = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return data;
}
