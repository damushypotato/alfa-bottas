import { MessageEmbed } from 'discord.js';
import { Config } from '.';
import ExtendedClient from '../../Client';
import { ApexPlatform } from '../Types/';

export interface ApexStatsEmbed {
    (
        platform: ApexPlatform,
        pId: string,
        token: string,
        client: ExtendedClient
    ): Promise<MessageEmbed>;
}

export interface ApexRotationEmbed {
    (token: string, client: ExtendedClient): Promise<MessageEmbed[]>;
}
