export { ClashProfile, PlayerData } from './ClashProfile';
export { ClashChests, UpcomingChestData } from './ClashChests';
export { ClashWarWeek, WarWeekData } from './ClashWarWeek';

import fetch from 'node-fetch';

export async function ClashRoyaleAPI(url: string, token: string) {
    const data = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    return data;
}
