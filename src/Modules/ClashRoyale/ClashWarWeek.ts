import { ClashRoyaleAPI } from '.';

interface Participant {
    tag: string;
    name: string;
    fame: number;
    repairPoints: number;
    boatAttacks: number;
    decksUsed: number;
    decksUsedToday: number;
}

interface Clan {
    tag: string;
    name: string;
    badgeId: number;
    fame: number;
    repairPoints: number;
    participants: Participant[];
    periodPoints: number;
    clanScore: number;
}

interface Clan_T2 {
    tag: string;
}

interface Item {
    clan: Clan_T2;
    pointsEarned: number;
    progressStartOfDay: number;
    progressEndOfDay: number;
    endOfDayRank: number;
    progressEarned: number;
    numOfDefensesRemaining: number;
    progressEarnedFromDefenses: number;
}

interface PeriodLog {
    periodIndex: number;
    items: Item[];
}

export interface WarWeekData {
    state: string;
    clan: Clan;
    clans: Clan[];
    sectionIndex: number;
    periodIndex: number;
    periodType: string;
    periodLogs: PeriodLog[];
}

export async function ClashWarWeek(tag: string, token: string) {
    tag = encodeURIComponent(tag);

    const url = `https://proxy.royaleapi.dev/v1/clans/${tag}/currentriverrace`;

    const res = await ClashRoyaleAPI(url, token);

    if (!res.ok) {
        return false;
    }

    const playerData: WarWeekData = await res.json() as WarWeekData;

    return playerData;
}
