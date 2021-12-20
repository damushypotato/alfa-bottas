import { MessageEmbed } from 'discord.js';
import { Config } from '.';
import { ApexPlatform } from '../Types/';

export interface ApexEmbed {
    (platform: ApexPlatform, pId: string, token: string, config: Config): Promise<MessageEmbed>;
}
