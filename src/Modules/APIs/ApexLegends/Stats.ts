import { EmbedFieldData, MessageEmbed } from 'discord.js';
import { ApexAPI } from '.';
import { ApexEmbed } from '../../../Structures/Interfaces';
import { ApexPlatform } from '../../../Structures/Types';

export namespace Stats {
    export interface StatsData {
        data: any;
    }

    export async function fetchStats(platform: ApexPlatform, pId: string, token: string) {
        pId = encodeURIComponent(pId);

        const res = await ApexAPI(platform, pId, token);

        if (!res) return false;

        return res.data as StatsData;
    }

    export const getEmbed: ApexEmbed = async (platform, pId, token, config) => {
        const req = await fetchStats(platform, pId, token);

        if (!req) return new MessageEmbed().setTitle('Unable to find profile.').setColor(config.color);

        const { data: stats } = req;

        const activeLegend = (stats.segments as any[]).find((s) => s.type == 'legend' && s.metadata.isActive);
        const legendStats: any[] = Object.values(activeLegend.stats);

        const statsEmbed = new MessageEmbed()
            .setAuthor(stats.platformInfo.platformUserId, stats.platformInfo.avatarUrl)
            .setTitle(activeLegend.metadata.name)
            .setFooter('Apex Legends', 'https://media.contentapi.ea.com/content/dam/apex-legends/common/logos/apex-copyright-sigil-white.png')
            .setColor(activeLegend.metadata.legendColor)
            .setDescription(`Level **${stats.segments[0].stats.level.displayValue}**`)
            .setImage(activeLegend.metadata.bgImageUrl)
            .setThumbnail(activeLegend.metadata.portraitImageUrl);

        if (legendStats.length > 0) {
            statsEmbed.addFields(
                legendStats.map((s) => {
                    return {
                        name: s.displayName,
                        value: s.displayValue,
                    } as EmbedFieldData;
                })
            );
        } else {
            statsEmbed.addField('Legend Stats', 'No Legend Stats Shown');
        }

        return statsEmbed;
    };
}
