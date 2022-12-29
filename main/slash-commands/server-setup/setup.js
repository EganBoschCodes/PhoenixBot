const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const FireStore = require("../../firebase/firestore.js");

module.exports = {
    name: "setup",
    options: ["channel"],
    description: "Designates the channel this command is used in for a specific bot-based role.",

	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Sets up what channels do what in your server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers)
		.addStringOption(option =>
			{ return option.setName('channel')
				.setDescription('What channel is being designated.')
				.setRequired(true).addChoices(
					{ name: 'Health', value: 'health channel' },
					{ name: 'Reporting', value: 'reporting channel' },
					{ name: 'Welcome', value: 'welcome channel' },
					{ name: 'Name Change', value: 'name change channel' },
					{ name: 'General', value: 'general' }
				)
				}),

	execute: async (client, interaction) => {
		let choice = interaction.options.getString("channel");
		let choiceFormatted = choice.toUpperCase().replaceAll(" ", "_");

		let guild = interaction.guildId;
		let channel = interaction.channelId;

		let guildData = await FireStore.getDefault({}, FireStore.Collections.GUILD_SETTINGS, guild);

		guildData[choiceFormatted] = channel;
		await FireStore.set(FireStore.Collections.GUILD_SETTINGS, guild, guildData);

		await interaction.reply({ content: 'Registered this channel as the designated ' + choice + '!', ephemeral: true });
	},
};