import { ClashRoyaleAPI } from '.';

interface Clan {
    tag: string;
    name: string;
    badgeId: number;
}

interface Arena {
    id: number;
    name: string;
}

interface CurrentSeason {
    trophies: number;
    bestTrophies: number;
}

interface PreviousSeason {
    id: string;
    trophies: number;
    bestTrophies: number;
}

interface BestSeason {
    id: string;
    trophies: number;
}

interface LeagueStatistics {
    currentSeason: CurrentSeason;
    previousSeason: PreviousSeason;
    bestSeason: BestSeason;
}

interface Badge {
    name: string;
    progress: number;
}

interface Achievement {
    name: string;
    stars: number;
    value: number;
    target: number;
    info: string;
    completionInfo?: any;
}

interface IconUrls {
    medium: string;
}

interface Card {
    name: string;
    id: number;
    level: number;
    maxLevel: number;
    count: number;
    iconUrls: IconUrls;
}

interface CurrentFavouriteCard {
    name: string;
    id: number;
    maxLevel: number;
    iconUrls: IconUrls;
}

interface PlayerData {
    tag: string;
    name: string;
    expLevel: number;
    trophies: number;
    bestTrophies: number;
    wins: number;
    losses: number;
    battleCount: number;
    threeCrownWins: number;
    challengeCardsWon: number;
    challengeMaxWins: number;
    tournamentCardsWon: number;
    tournamentBattleCount: number;
    role?: string;
    donations: number;
    donationsReceived: number;
    totalDonations: number;
    warDayWins: number;
    clanCardsCollected: number;
    clan?: Clan;
    arena: Arena;
    leagueStatistics?: LeagueStatistics;
    badges: Badge[];
    achievements: Achievement[];
    cards: Card[];
    currentDeck: Card[];
    currentFavouriteCard?: CurrentFavouriteCard;
}

export async function ClashProfile(tag: string, token: string) {
    tag = encodeURIComponent(tag);

    const url = `https://proxy.royaleapi.dev/v1/players/${tag}`;

    const res = await ClashRoyaleAPI(url, token);

    if (!res.ok) {
        return false;
    }

    const playerData: PlayerData = await res.json() as PlayerData;

    return playerData;
}
