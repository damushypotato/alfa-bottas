import { MessageEmbed, User } from 'discord.js';
import Command from '../../Modules/Command';
import { Config } from '../../Structures/Interfaces';

const getEmbed = (target: User, config: Config) => {
    const embed = new MessageEmbed()
        .setTitle(`heres ur pfp`)
        .setDescription(`<@${target.id}>`)
        .setImage(`${target.displayAvatarURL({ dynamic: true })}?size=1024`)
        .setFooter(config.embed_footer)
        .setColor(config.color);

    return embed;
}

const command = new Command({
    name: 'pfp',
    description: 'Shows a user\'s profile picture.',
});

command.textCommand = {
    usage: '<@User>',
    async run(client, message, [ mention ], data) {
        let target: User;
        if (mention) {
            target = client.tools.mentions.getUserFromMention(mention, client);
            if (!target) return command.sendUsage(message, data.prefix);
        }
        else {
            target = message.author;
        }
        
        message.channel.send({ embeds: [getEmbed(target, client.config)] });
    }
}

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            type: 'USER',
            name: 'target',
            description: 'The user whose pfp you want to get.',
            required: false,
        }
    ],
    async run(client, interaction, options, data) {
        const target = options.getUser('target') || interaction.user;

        interaction.followUp({ embeds: [getEmbed(target, client.config)] });
    }
}

export default command;