const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "pseed",
    options: [],
    description: "Obtain Minecraft world seed for Phoenix server",

    data: new SlashCommandBuilder()
		.setName('pseed')
		.setDescription("Obtain Minecraft world seed for Phoenix server"),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Phoenix Survival Seed: `https://www.chunkbase.com/apps/seed-map#3259590416100447320`", ephemeral: true });
    }
}