const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { createSimpleEmbed } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            await interaction.reply({ content: 'MonkaS', ephemeral: true });
            return;
        }
        //Member must be with the bot in the same channel
        if (connection.joinConfig.channelId !== interaction.member.voice.channelId) {
            await interaction.reply('On ne fait pas ça ici');
            return;
        }
        if (connection.player.state.status === AudioPlayerStatus.Idle && connection.nextSongPos === connection.queue.length) {
            await interaction.reply({ content: 'No song to skip', ephemeral: true });
            return;
        }

        connection.player.stop();
        const msg = createSimpleEmbed('Skipped the song');
        await interaction.reply({ embeds: [msg] });
    }
};