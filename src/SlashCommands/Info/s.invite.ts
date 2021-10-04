import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../Interfaces';

export const slashCommand: SlashCommand = {
    name: 'invite',
    description: 'The bot\'s invite link',
    type: 'CHAT_INPUT',
    async run(client, interaction, options, data) {
        const inviteURL = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`

        const body = `To Invite Me To Your Other Server, [Click Here!](${inviteURL})`;

        const embed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL())
            .setDescription(body)
            .setFooter(client.config.embed_footer)
            .setColor(client.config.color);

        interaction.followUp({ embeds: [embed] });
    }
}
