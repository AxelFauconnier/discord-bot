const { SlashCommandBuilder } = require('@discordjs/builders');
const { 
    getVoiceConnection, AudioPlayerStatus,
} = require('@discordjs/voice');
const { createQueueMessage } = require('../util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Affiche la liste de lecture'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if(!connection) {
            interaction.reply('MonkaS');
            return;
        }
        const queue = connection.queue;
        const message = createQueueMessage(queue, connection.nextSongPos, interaction, (connection.player.state.status === AudioPlayerStatus.Playing));
        interaction.reply({ embeds: [message] });
    }
};