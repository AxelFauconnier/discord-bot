const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { createSimpleEmbed } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue and skip current song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            await interaction.reply('MonkaS');
            return;
        }

        connection.queue = [];
        connection.nextSongPos = 0;
        connection.player.stop();
        const msg = createSimpleEmbed('Cleared the queue');
        await interaction.reply({ embeds: [msg] });
    }
};