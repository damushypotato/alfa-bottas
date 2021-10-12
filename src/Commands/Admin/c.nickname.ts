import Command from '../../Modules/Command';

const command = new Command({
    name: 'nickname',
    description: 'Change a user\'s nickname.',
    memberPerms: ['ADMINISTRATOR']
});

command.slashCommand = {
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to nick.',
            type: 'USER',
            required: true
        },
        {
            name: 'nickname',
            description: 'The new nickname.',
            type: 'STRING',
            required: true
        }
    ],
    async run(client, interaction, options, data) {

        const target =  interaction.guild.members.cache.get(options.getUser('user').id);

        if (!target) {
            return interaction.followUp('User not found.')
        }

        const nickInput = options.getString('nickname');
    
        if (nickInput.length > 32) {
            return interaction.followUp('That nickname is too long. The nickname must be shorter than 32 characters.')
        }
    
        if (nickInput == target.nickname) return interaction.followUp('Nickname already set!');
        
        await target.setNickname(nickInput);
    
        interaction.followUp(`Set ${target}'s nickname to \`${nickInput}\` !`);
    }
}

export default command;