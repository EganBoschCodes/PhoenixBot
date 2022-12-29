const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getCST } = require("../../utils.js");

module.exports = {
    name: "gettime",
    options: [],
    description: "Replies with what time the bot thinks it is, so you can check that server hours are aligned.",

	data: new SlashCommandBuilder()
		.setName('gettime')
		.setDescription('Replies with locale time for server hours tweaking.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	execute: async (client, interaction) => {
        interaction.reply({content: `Local: ${(new Date()).toLocaleString()}\nCST: ${getCST().toLocaleString()}`, ephemeral: true});
    }
};