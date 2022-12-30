const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "phoenix",
    options: [],
    description: "Obtain IP address for the Phoenix survival server",

    data: new SlashCommandBuilder()
		.setName('phoenix')
		.setDescription("Obtain IP address for the Phoenix survival server"),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Phoenix Survival (***1.19.2***): `smp.phoenixnetwork.tech`", ephemeral: true });
    }
}