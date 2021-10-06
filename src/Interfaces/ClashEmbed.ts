import { MessageEmbed } from 'discord.js';
import { Config } from '.';

export interface ClashEmbed {
    (tag: string, token: string, config: Config) : Promise<MessageEmbed>;
}
