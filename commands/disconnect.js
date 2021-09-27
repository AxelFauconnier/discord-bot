const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');
const { createSimpleEmbed } = require('../util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('disconnect')
		.setDescription('Quitte le canal de discussion'),
	async execute(interaction) {
        const connection = getVoiceConnection(interaction.guildId);
        if (!connection) {
            await interaction.reply('MonkaS');
            return;
        }
        //Member must be with the bot in the same channel
        if (connection.joinConfig.channelId !== interaction.member.voice.channelId) {
            await interaction.reply('On ne fait pas ça ici');
            return;
        }
        
        connection.destroy();
        const msg = createSimpleEmbed('Sayonara mina');
        await interaction.reply({ embeds: [msg] });
	},
};
