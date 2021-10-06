import { ClashRoyaleAPI } from '.';
import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { ClashEmbed } from '../../Interfaces';

export namespace War {

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

    export async function fetchClanWar(tag: string, token: string) {
        tag = encodeURIComponent(tag);

        const url = `https://proxy.royaleapi.dev/v1/clans/${tag}/currentriverrace`;

        const res = await ClashRoyaleAPI(url, token);

        if (!res.ok) return false;

        return await res.json() as WarWeekData;
    }

    export const getEmbed: ClashEmbed = async (tag, token, config) => {
        if (tag == '$') tag = '#L2JL9YUR';

        const war = await fetchClanWar(tag, token);

        if (!war) return new MessageEmbed()
            .setTitle('Unable to find clan war data.')
            .setColor(config.color);

        const warEmbed = new MessageEmbed()
            .setTitle(`Current war for ${war.clan.name}`)
            .setURL(`https://royaleapi.com/clan/${encodeURIComponent(war.clan.tag)}`)
            .setColor(config.color)
            .setFooter(config.embed_footer);

        const clanStandings = war.clans.sort((a, b) => b.fame - a.fame);

        if (war.periodType == 'colosseum') {
            warEmbed.addFields(clanStandings.map((c, i) => {
                return {
                    name: `#${i+1} - ${c.name}`,
                    value: `${c.fame} points`
                } as EmbedFieldData;
            }))
        }
        else {
            warEmbed.addFields(clanStandings.map((c, i) => {
                return {
                    name: `#${i+1} - ${c.name} - ${c.fame} points`,
                    value: `${c.periodPoints} medals today`
                } as EmbedFieldData;
            }))
        }

        return warEmbed;
    }
}
