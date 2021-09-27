const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const { processQueue, createSimpleEmbed } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Play the previous song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            await interaction.reply('MonkaS');
            return;
        }
        if (connection.queue.length === 0) {
            await interaction.reply({ content: 'Queue is empty', ephemeral: true });
            return;
        }

        connection.nextSongPos--;
        if (connection.player.state.status === AudioPlayerStatus.Playing) {
            connection.player.stop();
        } else {
            processQueue(connection);
        }
        const msg = createSimpleEmbed('Skipped to previous song');
        await interaction.reply({ embeds: [msg] });
    }
};