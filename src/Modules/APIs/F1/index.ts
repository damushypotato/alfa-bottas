export { WDC } from './WDC';
export { WCC } from './WCC';
export { NextGP } from './NextGP';
export { LastGP } from './LastGP';
import { Schedule } from 'formula1.js';
import Client from '../../../Structures/Client';

export const getSafeSeasons = async (
    client: Client,
    offset: number
): Promise<Schedule[]> => {
    const year = new Date().getFullYear();

    const y1 = client.api_cache.f1.fetchSchedule_Cached(year);
    const y2 = client.api_cache.f1.fetchSchedule_Cached(year + offset);

    return await Promise.all([y1, y2]);
};
