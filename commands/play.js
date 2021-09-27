const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    getInfo,
    validateURL,
 } = require('ytdl-core');
const {
    AudioPlayerStatus,
    createAudioPlayer,
    joinVoiceChannel,
    getVoiceConnection,
} = require('@discordjs/voice');
const { createEmbedPlayMessage, processQueue, createSimpleEmbed } = require('../util');
const { Song } = require('../music/song');
const ytsr = require('ytsr');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Queue up the song')
        .addStringOption(option => 
            option.setName('input')
            .setDescription('search query or youtube url')
            .setRequired(true)),
	async execute(interaction) {
        let connection = getVoiceConnection(interaction.guildId);
        const input = interaction.options.getString('input');

        if (!connection) {
            const guildId = interaction.guildId;
            const channelId = interaction.member.voice.channelId;

            if (!channelId) {
                await interaction.reply({ content: 'you must be in a voice channel', ephemeral: true});
                return;
            }

            connection = joinVoiceChannel({
                channelId: channelId,
                guildId: guildId,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            const player = createAudioPlayer();
            connection.subscribe(player);

            //Setting useful fields for music management
            connection.player = player;
            connection.queue = [];
            connection.nextSongPos = 0;

            //Player callbacks
            player.on('error', error => {
                console.error(error);
            });

            player.on(AudioPlayerStatus.Idle, async () => {
                processQueue(connection);
                //Launch timeout ?
            });
        }

        //Member must be with the bot in the same channel
        if (connection.joinConfig.channelId !== interaction.member.voice.channelId) {
            await interaction.reply('On ne fait pas ça ici');
            return;
        }

        await interaction.deferReply();
        let song;

        if (validateURL(input)) {
            const info = await getInfo(input);
            song = Song.fromURL(info);
        } else {
            const result = await ytsr(input, { limit: 1 });
            try {
                song = Song.fromSearch(result);
            }
            catch(error) {
                console.log(error);
                const msg = createSimpleEmbed('Sorry the result I got from your search is not a video');
                await interaction.editReply({ embeds: [msg] });
                return;
            }
        }

        connection.queue.push(song);
        const embedMessage = createEmbedPlayMessage(song, interaction, connection.queue.length);
        await interaction.editReply({ embeds: [embedMessage] });
        processQueue(connection);
	},
};
