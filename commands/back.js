const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('Play the previous song'),
    async execute(interaction) {
        //less one to counter then play next
        await interaction.reply({ content: 'to implement', ephemeral: true });
    }
};