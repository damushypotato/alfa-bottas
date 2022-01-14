import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { ApexAPI } from '.';
import { ApexStatsEmbed } from '../../../Structures/Interfaces';
import { ApexPlatform, CurrentLegends } from '../../../Structures/Types';

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

    interface Data_NV {
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
        badges?: Data_NV[];
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

    type CurrentBadges = [Badge, Badge, Badge];

    interface GameInfo {
        skin: string;
        skinRarity: string;
        frame: string;
        frameRarity: string;
        pose: string;
        poseRarity: string;
        intro: string;
        introRarity: string;
        badges: CurrentBadges;
    }

    interface LegendTracker_Rank {
        rankPos: number;
        topPercent: number;
    }

    interface LegendTracker {
        name: string;
        value: number;
        key: string;
        rank: LegendTracker_Rank;
        rankPlatformSpecific: LegendTracker_Rank;
    }

    interface ImageAssets {
        icon: string;
        banner: string;
    }

    interface Legend {
        data?: LegendTracker[];
        gameInfo?: GameInfo;
        ImgAssets: ImageAssets;
    }

    interface SelectedLegend extends Legend {
        LegendName: string;
    }

    type AllLegends = {
        [key in CurrentLegends]: Legend;
    };

    interface Legends {
        selected: SelectedLegend;
        all: AllLegends;
    }

    interface RateLimit {
        max_per_second: number;
        current_req: string;
    }

    interface MozambiquehereInternal {
        isNewToDB: boolean;
        claimedBy: string;
        APIAccessType: string;
        ClusterID: string;
        rate_limit: RateLimit;
        clusterSrv: string;
    }

    interface TotalTrackers {
        [key: string]: Data_NV;
    }

    export interface PlayerStats {
        global: GlobalInfo;
        realtime: RealtimeInfo;
        legends: Legends;
        mozambiquehere_internal: MozambiquehereInternal;
        total: TotalTrackers;
    }

    interface APIResponse {
        data: PlayerStats;
    }

    export async function fetchStats(
        platform: ApexPlatform,
        pId: string,
        token: string
    ): Promise<APIResponse | false> {
        pId = encodeURIComponent(pId);

        const url = `/bridge?version=5&platform=${platform}&player=${pId}&auth=${token}`;

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

    export const getEmbed: ApexStatsEmbed = async (
        platform,
        pId,
        token,
        config
    ) => {
        const api = await fetchStats(platform, pId, token);

        if (!api)
            return new MessageEmbed()
                .setTitle('Unable to find profile.')
                .setColor(config.color);

        const stats = api.data;

        const selectedLegend = stats.legends.selected;

        const badges = selectedLegend.gameInfo.badges
            .filter((b) => b.name != null)
            .map((b) => `*${b.name}*`)
            .join('\n');

        const statsEmbed = new MessageEmbed()
            .setAuthor(`${stats.global.name} on ${stats.global.platform}`)
            .setTitle(selectedLegend.LegendName)
            .setFooter(
                'Apex Legends',
                'https://media.contentapi.ea.com/content/dam/apex-legends/common/logos/apex-copyright-sigil-white.png'
            )
            .setColor(config.color)
            .setDescription(
                `Level **${stats.global.level}**\n` +
                    `BR Rank: **${stats.global.rank.rankName}**\n` +
                    `Arena Rank: **${stats.global.arena.rankName}**\n\n` +
                    `${selectedLegend.gameInfo.skinRarity} Skin: **${selectedLegend.gameInfo.skin}**` +
                    (badges ? `\n\n**Badges**:\n${badges}` : '')
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
