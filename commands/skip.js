const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (connection) {
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
            await interaction.reply('song skipped');
        } else {
            await interaction.reply({ content: 'MonkaS', ephemeral: true });
        }        
    }
};