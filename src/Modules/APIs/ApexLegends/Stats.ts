import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { stat } from 'fs';
import { ApexAPI } from '.';
import { ApexEmbed } from '../../../Structures/Interfaces';
import { ApexPlatform } from '../../../Structures/Types';

export namespace Stats {
    interface BansInfo {
        isActive: boolean;
        remainingSeconds: number;
        last_banReason: string;
    }

    interface Rank {
        rankScore: number;
        rankName: string;
        rankDiv: number;
        ladderPosPlatform: number;
        rankImg: string;
        rankedSeason: string;
    }

    interface BP_SeasonHistory {
        season1: number;
        season2: number;
        season3: number;
        season4: number;
        season5: number;
        season6: number;
        season7: number;
        season8: number;
        season9: number;
        season10: number;
        season11: number;
    }

    interface BattlepassHistory {
        level: string;
        history: BP_SeasonHistory;
    }

    interface Global_Badge {
        name: string;
        value: number;
    }

    interface GlobalInfo {
        name: string;
        uid: number;
        avatar?: string;
        platform: ApexPlatform;
        level: number;
        toNextLevelPercent: number;
        internalUpdateCount: number;
        bans: BansInfo;
        rank: Rank;
        arena: Rank;
        battlepass: BattlepassHistory;
        badges?: Global_Badge[];
    }

    interface RealtimeInfo {
        lobbyState: string;
        isOnline: number;
        isInGame: number;
        canJoin: number;
        partyFull: number;
        selectedLegend: string;
        currentState: string;
        currentStateSinceTimestamp: number;
        currentStateAsText: string;
    }

    interface Badge {
        name: string;
        value: number;
        category: string;
    }

    interface GameInfo {
        skin: string;
        skinRarity: string;
        frame: string;
        frameRarity: string;
        pose: string;
        poseRarity: string;
        intro: string;
        introRarity: string;
        badges?: Badge[];
    }

    interface ImgAssets {
        icon: string;
        banner: string;
    }

    export interface LegendStat {
        name: string;
        value: number;
        key: string;
    }

    interface SelectedLegend {
        LegendName: string;
        data?: LegendStat[];
        gameInfo: GameInfo;
        ImgAssets: ImgAssets;
    }

    export interface Legend {
        data?: LegendStat[];
        ImgAssets: ImgAssets;
    }

    export interface All {
        Revenant: Legend;
        Crypto: Legend;
        Horizon: Legend;
        Gibraltar: Legend;
        Wattson: Legend;
        Fuse: Legend;
        Bangalore: Legend;
        Wraith: Legend;
        Octane: Legend;
        Bloodhound: Legend;
        Caustic: Legend;
        Lifeline: Legend;
        Pathfinder: Legend;
        Loba: Legend;
        Mirage: Legend;
        Rampart: Legend;
        Valkyrie: Legend;
        Seer: Legend;
        Ash: Legend;
    }

    export interface Legends {
        selected: SelectedLegend;
        all: All;
    }

    export interface RateLimit {
        max_per_second: number;
        current_req: string;
    }

    export interface MozambiquehereInternal {
        isNewToDB: boolean;
        claimedBy: string;
        APIAccessType: string;
        ClusterID: string;
        rate_limit: RateLimit;
        clusterSrv: string;
    }

    export interface Stat_KV {
        name: string;
        value: string;
    }

    export interface Total {
        damage: Stat_KV;
        arenas_kills: Stat_KV;
        arenas_damage: Stat_KV;
        kd: Stat_KV;
    }

    export interface PlayerStats {
        global: GlobalInfo;
        realtime: RealtimeInfo;
        legends: Legends;
        mozambiquehere_internal: MozambiquehereInternal;
        total: Total;
    }

    interface APIResponse {
        data: PlayerStats;
    }

    export async function fetchStats(platform: ApexPlatform, pId: string, token: string): Promise<APIResponse | false> {
        pId = encodeURIComponent(pId);

        const url = `/bridge?version=5&platform=${platform}&player=${encodeURIComponent(pId)}&auth=${token}`;

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

    export const getEmbed: ApexEmbed = async (platform, pId, token, config) => {
        const api = await fetchStats(platform, pId, token);

        if (!api) return new MessageEmbed().setTitle('Unable to find profile.').setColor(config.color);

        const stats = api.data;

        const selectedLegend = stats.legends.selected;

        const statsEmbed = new MessageEmbed()
            .setAuthor(`${stats.global.name} on ${stats.global.platform}`)
            .setTitle(selectedLegend.LegendName)
            .setFooter('Apex Legends', 'https://media.contentapi.ea.com/content/dam/apex-legends/common/logos/apex-copyright-sigil-white.png')
            .setColor(config.color)
            .setDescription(
                `Level **${stats.global.level}**\n${selectedLegend.gameInfo.skinRarity} Skin: **${selectedLegend.gameInfo.skin}**` +
                    (selectedLegend.gameInfo.badges
                        ? `\n\n**Badges**:\n${selectedLegend.gameInfo.badges
                              .map((b) => (b.name ? `*${b.name}*` : null))
                              .filter(Boolean)
                              .join('\n')}`
                        : '')
            )
            .setImage(selectedLegend.ImgAssets.banner)
            .setThumbnail(selectedLegend.ImgAssets.icon);

        if (stats.legends.selected.data) {
            statsEmbed.addFields(
                stats.legends.selected.data.map((s) => {
                    return {
                        name: s.name,
                        value: s.value.toString(),
                        inline: true,
                    } as EmbedFieldData;
                })
            );
        } else {
            statsEmbed.addField('Legend Stats', 'No Legend Stats Shown');
        }

        return statsEmbed;
    };
}
