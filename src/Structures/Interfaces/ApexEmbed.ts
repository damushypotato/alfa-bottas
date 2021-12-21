import { MessageEmbed } from 'discord.js';
import { Config } from '.';
import { ApexPlatform } from '../Types/';

export interface ApexStatsEmbed {
    (platform: ApexPlatform, pId: string, token: string, config: Config): Promise<MessageEmbed>;
}

export interface ApexRotationEmbed {
    (token: string, config: Config): Promise<MessageEmbed[]>;
}
