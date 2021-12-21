export { Stats } from './Stats';

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
