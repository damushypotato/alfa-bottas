export { WDC } from './WDC';
export { WCC } from './WCC';
export { NextGP } from './NextGP';
export { LastGP } from './LastGP';
import { Schedule } from 'formula1.js';

export const getSafeSeasons = async (offset: number): Promise<Schedule[]> => {
    const year = new Date().getFullYear();

    return await Promise.all([
        new Schedule(year).get(),
        new Schedule(year + offset).get(),
    ]);
};
