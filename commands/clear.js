const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('clear the queue and skip current song'),
    async execute(interaction) {
        await interaction.reply({ content: 'to implement', ephemeral: true });
        // Reset queue, pos player.stop()
    }
};