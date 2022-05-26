export { WDC } from './WDC';
export { WCC } from './WCC';
export { NextGP } from './NextGP';
export { LastGP } from './LastGP';
import { Schedule } from 'formula1.js';
import { ScheduleResponse } from 'formula1.js/dist/Types/';

export const getSafeSeasons = async (
    offset: number
): Promise<ScheduleResponse[]> => {
    const year = new Date().getFullYear();

    return await Promise.all([Schedule(year), Schedule(year + offset)]);
};
