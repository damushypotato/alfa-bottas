export { Stats } from './Stats';

import axios from 'axios';
import { ApexPlatform } from '../../../Structures/Types';

export async function ApexAPI(platform: ApexPlatform, pId: string, token: string) {
    try {
        const data = await axios.get(`${platform}/${pId}`, {
            baseURL: 'https://public-api.tracker.gg/v2/apex/standard/profile',
            headers: {
                'TRN-Api-Key': token,
            },
            responseType: 'json',
        });

        return data;
    } catch {
        return false;
    }
}
