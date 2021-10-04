import { ClashRoyaleAPI } from '.';

interface Chest {
    index: number;
    name: string;
}

export interface UpcomingChestData {
    items: Chest[];
}

export async function ClashChests(tag: string, token: string) {
    tag = encodeURIComponent(tag);

    const url = `https://proxy.royaleapi.dev/v1/players/${tag}/upcomingchests`;

    const res = await ClashRoyaleAPI(url, token);

    if (!res.ok) {
        return false;
    }

    const playerData: UpcomingChestData = await res.json() as UpcomingChestData;

    return playerData;
}
