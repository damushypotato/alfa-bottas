import {} from 'discord.js';
import { ApexAPI } from '.';
import { ApexRotationEmbed } from '../../../Types';

export namespace MapRotation {
    interface Current {
        start: number;
        end: number;
        readableDate_start: string;
        readableDate_end: string;
        map: string;
        code: string;
        DurationInSecs: number;
        DurationInMinutes: number;
        asset: string;
        remainingSecs: number;
        remainingMins: number;
        remainingTimer: string;
    }

    interface Next {
        start: number;
        end: number;
        readableDate_start: string;
        readableDate_end: string;
        map: string;
        code: string;
        DurationInSecs: number;
        DurationInMinutes: number;
    }

    export interface BR_Rotation {
        current: Current;
        next: Next;
    }

    export interface Arenas_Rotation {
        current: Current;
        next: Next;
    }

    export interface BR_Ranked_Current {
        map: string;
        asset: string;
    }

    export interface BR_Ranked_Next {
        map: string;
    }

    export interface BR_Ranked_Rotation {
        current: BR_Ranked_Current;
        next: BR_Ranked_Next;
    }

    export interface Arenas_Ranked_Rotation {
        current: Current;
        next: Next;
    }

    export interface MapRotation {
        battle_royale: BR_Rotation;
        arenas: Arenas_Rotation;
        ranked: BR_Ranked_Rotation;
        arenasRanked: Arenas_Ranked_Rotation;
    }

    interface APIResponse {
        data: MapRotation;
    }

    export async function fetchRotation(
        token: string
    ): Promise<APIResponse | false> {
        const url = `maprotation?version=2&auth=${token}`;

        const res = await ApexAPI(url);

        if (!res) return false;

        const data: any = res.data;

        const error: boolean = data.Error != null;

        if (error) {
            return false;
        }

        return {
            data,
        };
    }

    export const getEmbed: ApexRotationEmbed = async (token, client) => {
        const api = await fetchRotation(token);

        if (!api)
            return [client.newEmbed({ title: 'Unable to find profile.' })];

        const maps = api.data;

        const br_embed = client.newEmbed({
            title: 'Battle Royale',
            description: `Current map - \`${maps.battle_royale.current.map}\`\n\nNext map - \`${maps.battle_royale.next.map}\`\n\nTime until next map - \`${maps.battle_royale.current.remainingTimer}\``,
            image: {
                url: maps.battle_royale.current.asset,
            },
        });

        const arenas_embed = client.newEmbed({
            title: 'Arenas',
            description: `Current map - \`${maps.arenas.current.map}\`\n\nNext map - \`${maps.arenas.next.map}\`\n\nTime until next map - \`${maps.arenas.current.remainingTimer}\``,
            image: {
                url: maps.arenas.current.asset,
            },
        });

        const br_ranked_embed = client.newEmbed({
            title: 'Ranked Battle Royale',
            description: `\`${maps.ranked.current.map}\``,
            image: {
                url: maps.ranked.current.asset,
            },
        });

        const arenas_ranked_embed = client.newEmbed({
            title: 'Ranked Arenas',
            description: `Current map - \`${maps.arenasRanked.current.map}\`\n\nNext map - \`${maps.arenasRanked.next.map}\`\n\nTime until next map - \`${maps.arenasRanked.current.remainingTimer}\``,
            image: {
                url: maps.arenasRanked.current.asset,
            },
        });

        return [br_embed, arenas_embed, br_ranked_embed, arenas_ranked_embed];
    };
}
