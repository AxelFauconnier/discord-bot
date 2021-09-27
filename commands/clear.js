const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue and skip current song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);

        if (!connection) {
            await interaction('MonkaS');
            return;
        }

        connection.queue = [];
        connection.nextSongPos = 0;
        connection.player.stop();
        await interaction.reply({ content: 'queue cleared', ephemeral: false });
    }
};