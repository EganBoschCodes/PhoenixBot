const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "pcc",
    options: [],
    description: "Obtain IP address for Phoenix Creative-Copy.",

    data: new SlashCommandBuilder()
		.setName('pcc')
		.setDescription('Obtain IP address for Phoenix Creative-Copy.'),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Phoenix Creative-Copy (***1.19.2***): `pcc.phoenixnetwork.tech`", ephemeral: true });
    }
}