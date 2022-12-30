const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getEmbed, niceCaps } = require("../../utils.js");

const fs = require('fs');
const path = require('path');

let summarizeCommand = (command) => {
    let str = `\`/${command.name}`;

    if (command.options) {
        for (let option of command.options) {
            str += ` [${option}]`;
        }
    }
    
    str +=`\`: ${command.description}`;
    return str;
}

module.exports = {
    name: "help",
    options: [],
    description: "Provides a list of all commands and their functionality.",

	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Read bot command summaries.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	execute: async (client, interaction) => {
        let embed = getEmbed()
            .setTitle("Help Menu")
            .setThumbnail(`https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp?size=64`);


        const dirPath = path.resolve(__dirname, '../.');
        const commandFolders = fs.readdirSync(dirPath).filter(file =>  !(file.endsWith('.js')) );

        for (let i = 0; i < commandFolders.length; i++) {
            folder = commandFolders[i];
            if (i > 0) {
                embed.addFields({ name: '\u200b', value: '\u200b' });
            }
            let commandText = fs.readdirSync(dirPath+"/"+folder)
                .filter(file => (file.endsWith('.js')))
                .map(file => require(`../${folder}/${file}`))
                .map(summarizeCommand)
                .join("\n\n");

            embed.addFields({name: niceCaps(folder, "-")+":", value: commandText });
        }

        interaction.reply({embeds: [embed]});

    }
};
