const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('remove the indicated song')
        .addIntegerOption(option => 
            option.setName('index')
                .setDescription('index of the song in the queue')
                .setRequired(true)),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            await interaction('MonkaS');
            return;
        }
        //User index is offset i.e first song is indexed at 1 instead of 0, so index - 1 is the real index
        const index = interaction.options.getInteger('index') - 1;
        if (index >= connection.queue.length || index < 0) {
            await interaction.reply({ content: 'not a valid index', ephemeral: true });
            return;
        }

        const removedSong = connection.queue[index];
        connection.queue.splice(index, 1);
        const msg = 'Removed ***' + removedSong.title + '***';
        await interaction.reply({ content: msg, ephemeral: false });
    }
};