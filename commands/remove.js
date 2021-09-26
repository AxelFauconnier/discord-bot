const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('remove the indicated song')
        .addIntegerOption(option => 
            option.setName('index')
                .setDescription('index of the song in the queue')
                .setRequired(true)),
    async execute(interaction) {
        //User index is offset i.e first song is indexed at 1 instead of 0, so index - 1 is the real index
        const index = interaction.options.getInteger('index');
        await interaction.reply({ content: 'to implement', ephemeral: true });
    }
};