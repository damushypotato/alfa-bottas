import { ClashRoyaleAPI } from '.';
import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { ClashEmbed } from '../../../Structures/Interfaces';

export namespace Profile {

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

    export interface PlayerData {
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

    export async function fetchPlayer(tag: string, token: string) {
        tag = encodeURIComponent(tag);

        const url = `/players/${tag}`;

        const res = await ClashRoyaleAPI(url, token);

        if (res.status != 200) return false;

        return res.data as PlayerData;
    }

    export const getEmbed: ClashEmbed = async (tag, token, config) => {

        const profile = await fetchPlayer(tag, token);

        if (!profile) return new MessageEmbed()
            .setTitle('Unable to find profile data.')
            .setColor(config.color)

        const fields: EmbedFieldData[] = [
            {
                name: `Level`, value: profile.expLevel.toString()
            },
            {
                name: `${profile.trophies} Trophies`, value: profile.arena.name
            },
            {
                name: 'Wins', value: profile.wins.toString()
            },
            {
                name: 'Losses', value: profile.losses.toString()
            },
            {
                name: 'Three Crown Wins', value: profile.threeCrownWins.toString()
            },
            {
                name: 'Total Donations', value: profile.totalDonations.toString()
            },
            {
                name: 'Clan', value: profile.clan ? `${profile.clan?.name} - ${profile.role}` : 'No clan.'
            },
            {
                name: 'Deck', value: profile.currentDeck.map(x => x.name).join(' - ') || 'None.'
            },
            {
                name: 'Favourite card', value: profile.currentFavouriteCard?.name || 'None.'
            },
        ];

        const profileEmbed = new MessageEmbed()
            .setTitle(`Stats for ${profile.name || profile.tag}`)
            .setURL(`https://royaleapi.com/player/${encodeURIComponent(profile.tag)}`)
            .addFields(fields)
            .setColor(config.color)
            .setFooter(config.embed_footer);

        return profileEmbed;
    }
}
