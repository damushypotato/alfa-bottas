import { MessageEmbed } from 'discord.js'
import { Command } from '../../Interfaces';
import { Profile, Chests, War, HashtagHelper } from './../../Modules/ClashRoyale'

export const command: Command = {
    name: 'clashstats',
    description: 'Upcoming chests for clash royale',
    aliases: ['crstats'],
    usage: 'clashstats <player / chests / war> #TAG',
    async run(client, message, args, data) {
        if (!args[1]) return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        let [stat, tag] = args;
        if (stat != 'player' && stat != 'chests' && stat != 'war')
            return message.channel.send(`Usage: ${data.prefix}${this.usage}`);

        tag = tag.toUpperCase();
        
        if (tag != '$') {
            tag = '#' + HashtagHelper.normalizeHashtag(tag);

            if (!HashtagHelper.isValidHashtag(tag)) {
                return message.channel.send('Thats not a real hashtag yo');
            }
        }

        const token = client.secrets.API_KEYS.CR;
        const { config } = client;

        const fetchingEmbed = new MessageEmbed()
            .setTitle('Fetching data...')
            .setColor(client.config.color);

        const send_fetchingEmbed = message.channel.send({ embeds: [fetchingEmbed] });
        
        let api_req: Promise<MessageEmbed>;
        if (stat == 'war') {
            api_req = War.getEmbed(tag, token, config);
        }
        else if (stat == 'player') {
            api_req = Profile.getEmbed(tag, token, config);
        }
        else if (stat == 'chests') {
            api_req = Chests.getEmbed(tag, token, config);
        }
        else {
            return message.channel.send({ embeds: [new MessageEmbed()
                .setTitle('Unknown stat.')
                .setColor(client.config.color)
            ]});
        }

        const [embed, sent] = await Promise.all([api_req, send_fetchingEmbed]);

        sent.edit({ embeds: [embed] });
    }
}
