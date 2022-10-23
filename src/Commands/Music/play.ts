// import { Track } from 'discord-player';
// import {
//     Guild,
//     GuildMember,
//     InteractionReplyOptions,
//     MessageEditOptions,
//     MessageOptions,
//     TextBasedChannel,
//     VoiceBasedChannel,
// } from 'discord.js';
// import Client from '../../Structures/Client';
// import Command from '../../Structures/Command';

// const common = async (
//     client: Client,
//     guild: Guild,
//     channel: TextBasedChannel,
//     vc: VoiceBasedChannel,
//     track: Track
// ): Promise<MessageOptions> => {

// };

// const command = new Command({
//     name: 'play',
//     description: 'Play songs from YouTube in a voice channel.',
// });

// command.textCommand = {
//     usage: '<song title>',
//     aliases: ['p'],
//     async run(client, message, args, data) {
//         const { player } = client;
//         const query = data.fullArgs;
//         const member = message.member;

//         if (!query) {
//             return command.sendUsage(message, data.prefix);
//         }

//         if (!member.voice.channel)
//             return message.channel.send(
//                 'Join a voice channel first you dumbass.'
//             );

//         const sent_fetchingEmbed = message.channel.send({
//             embeds: [client.fetchingEmbed()],
//         });

//         const req = player.search(query, {
//             requestedBy: message.author,
//         });

//         const [sent, result] = await Promise.all([sent_fetchingEmbed, req]);

//         const track = result.tracks[0];

//         sent.edit(
//             (await common(
//                 client,
//                 message.guild,
//                 message.channel,
//                 message.member.voice.channel,
//                 track
//             )) as MessageEditOptions
//         );
//     },
// };

// command.slashCommand = {
//     type: 'CHAT_INPUT',
//     options: [

//     ],
//     async run(client, interaction, options, data) {

//     },
// };

// export default command;

import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import Command from '../../Structures/Command';

export default new Command({
    name: 'play',
    description: 'Play a song.',
    ownerOnly: false,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'search',
            description: 'The song to search for.',
            required: true,
        },
    ],
    memberPerms: [],
    run: async (client, int, options, ctx, userCache, guildCache) => {
        const { player } = client;
        const query = options.getString('search');
        const member = int.member as GuildMember;
        const vc = member.voice.channel;

        if (!member.voice.channel) return ctx.send('Join a voice channel first you dumbass.');

        const track = (
            await player.search(query, {
                requestedBy: int.user,
            })
        ).tracks[0];

        if (
            int.guild.members.me.voice.channelId &&
            vc.id !== int.guild.members.me.voice.channelId
        ) {
            return ctx.sendEmbed(
                client.newEmbed({
                    title: '🚫 You are not in my voice channel.',
                })
            );
        }

        const queue = client.player.createQueue(int.guild, {
            metadata: int.channel,
        });

        try {
            if (!queue.connection) await queue.connect(vc);
        } catch {
            queue.destroy();
            return {
                embeds: [
                    client.newEmbed({
                        title: '❌ Could not join your voice channel.',
                    }),
                ],
            };
        }

        try {
            queue.addTrack(track);
        } catch {
            return {
                embeds: [
                    client.newEmbed({
                        title: '🚫 Invalid track.',
                    }),
                ],
            };
        }

        if (!queue.playing) queue.play();

        ctx.send({
            content: `${track.url}\n${queue.playing ? '✅ Added to queue' : '🎶 Playing'}: \`${
                track.title
            }\``,
            embeds: [],
        });
    },
});
