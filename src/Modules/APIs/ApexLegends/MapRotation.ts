import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { ApexAPI } from '.';
import { ApexRotationEmbed } from '../../../Structures/Interfaces';

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

    export async function fetchRotation(token: string): Promise<APIResponse | false> {
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

    export const getEmbed: ApexRotationEmbed = async (token, config) => {
        const api = await fetchRotation(token);

        if (!api) return [new MessageEmbed().setTitle('Unable to find profile.').setColor(config.color)];

        const maps = api.data;

        const br_embed = new MessageEmbed()
            .setTitle('Battle Royale')
            .setColor(config.color)
            .setDescription(
                `Current map - \`${maps.battle_royale.current.map}\`\n\nNext map - \`${maps.battle_royale.next.map}\`\n\nTime until next map - \`${maps.battle_royale.current.remainingTimer}\``
            )
            .setImage(maps.battle_royale.current.asset);

        const arenas_embed = new MessageEmbed()
            .setTitle('Arenas')
            .setColor(config.color)
            .setDescription(
                `Current map - \`${maps.arenas.current.map}\`\n\nNext map - \`${maps.arenas.next.map}\`\n\nTime until next map - \`${maps.arenas.current.remainingTimer}\``
            )
            .setImage(maps.arenas.current.asset);

        const br_ranked_embed = new MessageEmbed()
            .setTitle('Ranked Battle Royale')
            .setColor(config.color)
            .setDescription(`\`${maps.ranked.current.map}\``)
            .setImage(maps.ranked.current.asset);

        const arenas_ranked_embed = new MessageEmbed()
            .setTitle('Ranked Arenas')
            .setColor(config.color)
            .setDescription(
                `Current map - \`${maps.arenasRanked.current.map}\`\n\nNext map - \`${maps.arenasRanked.next.map}\`\n\nTime until next map - \`${maps.arenasRanked.current.remainingTimer}\``
            )
            .setImage(maps.arenasRanked.current.asset);

        return [br_embed, arenas_embed, br_ranked_embed, arenas_ranked_embed];
    };
}
