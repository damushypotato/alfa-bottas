import { ClashRoyaleAPI } from '.';
import { MessageEmbed, EmbedFieldData } from 'discord.js';
import { ClashEmbed } from '../../Interfaces';

export namespace Chests {

    interface Chest {
        index: number;
        name: string;
    }

    export interface UpcomingChestData {
        items: Chest[];
    }

    export async function fetchChests(tag: string, token: string) {
        tag = encodeURIComponent(tag);

        const url = `/players/${tag}/upcomingchests`;

        const res = await ClashRoyaleAPI(url, token);

        if (res.status != 200) return false;

        return res.data as UpcomingChestData;
    }

    export const getEmbed: ClashEmbed = async (tag, token, config) => {

        const chests = await fetchChests(tag, token);

        if (!chests) return new MessageEmbed()
            .setTitle('Unable to find chest data.')
            .setColor(config.color);

        const chestsEmbed = new MessageEmbed()
        .setTitle(`Upcoming chests for ${tag}`)
        .setURL(`https://royaleapi.com/player/${encodeURIComponent(tag)}`)
        .addFields(chests.items.map(c => {
            return {
                name: c.name,
                value: c.index == 0 ? 'Next' : `+${c.index}`
            } as EmbedFieldData;
        }))
        .setColor(config.color)
        .setFooter(config.embed_footer)

        return chestsEmbed;
    }
}
