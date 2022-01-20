export * from './Timezones';
export * from './Time';

import axios from 'axios';

export async function WorldTimeAPI(url: string) {
    try {
        const data = await axios.get(url, {
            baseURL: 'http://worldtimeapi.org/api',
            responseType: 'json',
        });

        return data;
    } catch {
        return false;
    }
}
