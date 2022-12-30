const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "extra",
    options: [],
    description: "Obtain IP address for Planet Craft's creative server.",

    data: new SlashCommandBuilder()
		.setName('extra')
		.setDescription("Obtain IP address for Planet Craft's creative server."),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Phoenix Extra (**1.19.2**): `extra.phoenixnetwork.tech`", ephemeral: true });
    }
}