export { Profile } from './Profile';
export { Chests } from './Chests';
export { War }  from './War';
export { HashtagHelper } from './HashtagHelper';

import axios from 'axios';

export async function ClashRoyaleAPI(url: string, token: string) {
    const data = await axios.get(url, {
        baseURL: 'https://proxy.royaleapi.dev/v1/',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        responseType: 'json',
    });

    return data;
}
