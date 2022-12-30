const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "smpv5",
    options: [],
    description: "Obtain IP address for Planet Craft Season 7: SMPv5",

    data: new SlashCommandBuilder()
		.setName('smpv5')
		.setDescription("Obtain IP address for Planet Craft Season 7: SMPv5"),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Planet Craft Season 7: SMPv2 (***1.19.2***):  `smpv5.phoenixnetwork.tech`", ephemeral: true });
    }
}