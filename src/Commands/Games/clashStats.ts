import Command from '../../Modules/Command';
import { MessageEmbed } from 'discord.js';
import { Profile, Chests, War, HashtagHelper } from '../../Modules/APIs/ClashRoyale';
import { Config } from '../../Structures/Interfaces';

const validStat = ['player', 'chests', 'war'] as const;
type Stat = typeof validStat[number];

const getStat = (stat: Stat, tag: string, token: string, config: Config) => {
    if (stat == 'war') {
        return War.getEmbed(tag, token, config);
    }
    if (stat == 'player') {
        return Profile.getEmbed(tag, token, config);
    }
    if (stat == 'chests') {
        return Chests.getEmbed(tag, token, config);
    }
}

const command = new Command({
    name: 'clashstats',
    description: 'Stats for Clash Royale',
});

command.textCommand = {
    usage: '<player | chests | war> #TAG',
    aliases: ['crstats'],
    async run(client, message, args, data) {

        if (!args[1]) return command.sendUsage(message, data.prefix);

        let [statIn, tag] = args;

        const stat = statIn as Stat;

        if (!validStat.map(x => x as string).includes(stat)) return command.sendUsage(message, data.prefix);
        
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
        
        let statEmbed = getStat(stat, tag, token, config);

        const [embed, sent] = await Promise.all([statEmbed, send_fetchingEmbed]);

        sent.edit({ embeds: [embed] });
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'SUB_COMMAND',
            name: 'player',
            description: 'Gets CR stats for a player',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The player #TAG',
                    required: true
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'chests',
            description: 'Gets CR upcoming chests for a player',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The player #TAG',
                    required: true
                }
            ],
        },
        {
            type: 'SUB_COMMAND',
            name: 'war',
            description: 'Gets CR clan war standings',
            options: [
                {
                    type: 'STRING',
                    name: 'tag',
                    description: 'The clan #TAG (type \'$\' for Daddy Hasbulla)',
                    required: true
                }
            ],
        },
    ],
    async run(client, interaction, options, data) {

        const stat = options.getSubcommand() as Stat;
        let tag = options.getString('tag');
        
        if (tag != '$') {
            tag = '#' + HashtagHelper.normalizeHashtag(tag);

            if (!HashtagHelper.isValidHashtag(tag)) {
                return interaction.followUp('Thats not a real hashtag yo');
            }
        }
        
        const token = client.secrets.API_KEYS.CR;
        const { config } = client;
        
        interaction.followUp({ embeds: [await getStat(stat, tag, token, config)] });
    }
}

export default command;