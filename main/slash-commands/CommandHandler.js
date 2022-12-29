const fs = require('fs');
const path = require('path');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require('discord.js');

const FireStore = require("../firebase/firestore.js");

require("dotenv").config();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;



module.exports = {
	registerCommands: async (client) => {
        let commands = [];
		client.commands = new Collection();

        const dirPath = path.resolve(__dirname, '.');
        const commandFolders = fs.readdirSync(dirPath).filter(file =>  !(file.endsWith('.js')) );

        let commandFiles = [];
        for (let folder of commandFolders) {
            fs.readdirSync(dirPath+"/"+folder)
                .filter(file => (file.endsWith('.js')))
                .forEach((file) => commandFiles.push(`${folder}/${file}`));
        }

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
		}
		
		const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

		let guilds = await FireStore.getCollectionAsObj(FireStore.Collections.GUILD_SETTINGS);

		for (let guild in guilds) {
            if ((process.env.ENVIRONMENT === "dev" && guild !== "1022516286669987850") || (process.env.ENVIRONMENT !== "dev" && guild === "1022516286669987850")) continue;
            
			rest.put(Routes.applicationGuildCommands(CLIENT_ID, guild), { body: commands })
				.then(() => console.log(`Successfully registered application commands in guild ${guild}.`))
				.catch(console.error);
		}
		
	},

    handleInteraction: async (client, interaction) => {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

