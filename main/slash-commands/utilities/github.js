const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "github",
    options: [],
    description: "Links my (BoschMods) github, to see all of my projects!",

    data: new SlashCommandBuilder()
		.setName('github')
		.setDescription("Links my (BoschMods) github, to see all of my projects!"),

    execute: async (client, interaction) => {
        await interaction.reply({ content: "Bosch's Github: `https://github.com/EganBoschCodes/`", ephemeral: true });
    }
}