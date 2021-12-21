export { Stats } from './Stats';
export { MapRotation } from './MapRotation';

import axios from 'axios';

export async function ApexAPI(url: string) {
    try {
        const data = await axios.get(url, {
            baseURL: 'https://api.mozambiquehe.re',
            responseType: 'json',
        });

        return data;
    } catch {
        return false;
    }
}
